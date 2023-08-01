import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { StatusMessageDto } from 'src/shared/dto';
import {
  CredentialInvalidException,
  EmailUsernameExistException,
  TokenInvalidException,
} from 'src/shared/http-exceptions/exceptions';
import { HashHelper } from 'src/shared/helpers';
import {
  ContinueProviderRequestDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  SignInRequestDto,
  SignUpRequestDto,
  TokensDto,
} from '../dto';
import { TokenService } from './token.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/modules/email/services/email.service';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { UserService } from 'src/modules/user/services/user.service';
import { AwsS3Service } from 'src/common/aws/services/aws.s3.service';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private userService: UserService,
    private tokenService: TokenService,
    private emailService: EmailService,
    private awsS3Service: AwsS3Service,
    private config: ConfigService,
  ) {}

  async signIn(signInDto: SignInRequestDto): Promise<TokensDto> {
    const user = await this.userRepository.findOne(
      { email: signInDto.email },
      { select: { password: 1, email: 1, picture: 1 } },
    );

    const userHashedPassword = user ? user.password : '';
    const isPasswordCorrect = await HashHelper.compare(
      signInDto.password,
      userHashedPassword,
    );

    const userId = user ? user._id : '';

    if (!user || !isPasswordCorrect) throw new CredentialInvalidException();

    const tokens = await this.tokenService.generateAuthTokens({
      id: userId,
      email: user.email,
    });

    return tokens;
  }

  async continueWithProvider(
    providerRequestDto: ContinueProviderRequestDto,
  ): Promise<TokensDto> {
    const userJwt = await this.tokenService.verifyGoogleIdToken(
      providerRequestDto.jwtToken,
    );

    if (!userJwt?.email || !userJwt.given_name)
      throw new TokenInvalidException();

    let user = await this.userRepository.findOne({ email: userJwt.email });
    if (!user) {
      const imageUrl =
        userJwt.picture ??
        `${this.config.get('GRAVATAR_URL')}/${HashHelper.hashCrypto(
          userJwt.email,
        )}?s=300&d=identicon`;
      const blob: AxiosResponse<Buffer> = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });
      const picture = await this.awsS3Service.putItemInBucket(
        blob.data,
        {
          extension: 'png',
          filename: 'picture.png',
          mimetype: 'image/png',
        },
        { path: '/private/profile' },
      );
      user = await this.userRepository.create({
        email: userJwt.email,
        firstName: userJwt.given_name,
        lastName: userJwt.family_name,
        isViaProvider: true,
        picture,
      });
      await this.emailService.sendMail({
        to: user.email,
        subject: 'Welcome to Tracka Application',
        templateName: 'welcome',
        name: user.firstName,
        url: this.config.get('URL_CLIENT'),
      });
    }

    return this.tokenService.generateAuthTokens({
      id: user._id,
      email: user.email,
    });
  }

  async signUp(signUpDto: SignUpRequestDto): Promise<StatusMessageDto> {
    const user = await this.userRepository.findOne({ email: signUpDto.email });
    if (user) throw new EmailUsernameExistException();

    const newUser = await this.userRepository.create({
      ...signUpDto,
      isViaProvider: false,
      picture: `${this.config.get('GRAVATAR_URL')}/${HashHelper.hashCrypto(
        signUpDto.email,
      )}?s=300&d=identicon`,
    });
    await this.emailService.sendMail({
      to: newUser.email,
      subject: 'Welcome to Tracka Application',
      templateName: 'welcome',
      name: newUser.firstName,
      url: this.config.get('URL_CLIENT'),
    });

    return { message: 'Success' };
  }

  async signOut(userId: string): Promise<StatusMessageDto> {
    await this.userRepository.updateOneById(userId, {
      hashedRefreshToken: null,
    });

    await this.userService.removeDevice(userId);
    return { message: 'Success' };
  }

  async refreshToken(userId: string, refreshToken: string): Promise<TokensDto> {
    const user = await this.userRepository.findOneById(userId, {
      select: { email: 1, hashedRefreshToken: 1 },
    });
    if (!user?.hashedRefreshToken) {
      await this.userService.removeDevice(userId);
      throw new TokenInvalidException();
    }

    const isRefreshTokenMatch = await HashHelper.compare(
      refreshToken,
      user.hashedRefreshToken,
    );
    if (!isRefreshTokenMatch) {
      await this.userService.removeDevice(userId);
      throw new TokenInvalidException();
    }

    return this.tokenService.generateAuthTokens({
      id: userId,
      email: user.email,
    });
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<StatusMessageDto> {
    const resetToken = this.tokenService.generateResetPasswordToken();
    const user = await this.userRepository.updateOne(
      { email: forgotPasswordDto.email },
      {
        passwordResetToken: resetToken.hashedResetToken,
        passwordResetExpires: resetToken.expiresToken,
      },
    );
    if (user) {
      await this.emailService.sendMail({
        to: user.email,
        subject: 'Reset Password',
        templateName: 'reset-password',
        name: user.firstName,
        url: `${this.config.get('URL_CLIENT')}/auth/reset-password?token=${
          resetToken.resetToken
        }`,
      });
    }
    return { message: 'Success' };
  }

  async verifyTokenResetPassword(token: string): Promise<StatusMessageDto> {
    const user = await this.tokenService.verifyResetPasswordToken(token);
    if (!user) throw new TokenInvalidException();

    return { message: 'Success' };
  }

  async resetPassword(
    token: string,
    resetPasswordDto: ResetPasswordDto,
  ): Promise<StatusMessageDto> {
    const user = await this.tokenService.verifyResetPasswordToken(token);
    if (!user) throw new TokenInvalidException();

    user.password = resetPasswordDto.password;
    user.passwordConfirm = resetPasswordDto.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.hashedRefreshToken = undefined;
    await user.save();

    await this.emailService.sendMail({
      to: user.email,
      subject: 'Reset Password Successful',
      url: `${this.config.get('URL_CLIENT')}/auth/sign-in`,
      templateName: 'success-reset-password',
      name: user.firstName,
    });

    return { message: 'Success' };
  }
}
