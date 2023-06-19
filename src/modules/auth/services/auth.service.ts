import { Injectable } from '@nestjs/common';
import { StatusMessageDto } from 'src/common/dto';
import {
  CredentialInvalidException,
  EmailUsernameExistException,
  TokenInvalidException,
} from 'src/common/http-exceptions/exceptions';
import { HashHelper } from 'src/helpers';
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
import { UsersRepository } from 'src/modules/users/repositories/users.repository';
import { UsersService } from 'src/modules/users/services/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private userService: UsersService,
    private tokenService: TokenService,
    private emailService: EmailService,
    private config: ConfigService,
  ) {}

  async signIn(signInDto: SignInRequestDto): Promise<TokensDto> {
    const user = await this.usersRepository.findOne(
      { email: signInDto.email },
      { select: { password: 1, email: 1, picture: 1 } },
    );

    const userHashedPassword = user ? user.password : '';
    const isPasswordCorrect = await HashHelper.compare(
      signInDto.password,
      userHashedPassword,
    );

    const userId = user ? user._id : '';
    const tokens = await this.tokenService.generateAuthTokens({ id: userId });

    if (!user || !isPasswordCorrect) throw new CredentialInvalidException();

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

    let user = await this.usersRepository.findOne({ email: userJwt.email });
    if (!user) {
      user = await this.usersRepository.create({
        email: userJwt.email,
        firstName: userJwt.given_name,
        lastName: userJwt.family_name,
        isViaProvider: true,
        picture:
          userJwt.picture ??
          `${this.config.get('GRAVATAR_URL')}/${HashHelper.hashCrypto(
            userJwt.email,
          )}?s=300&d=identicon`,
      });
      await this.emailService.sendMail({
        to: user.email,
        subject: 'Welcome to Tracka Application',
        templateName: 'welcome',
        name: user.firstName,
        url: this.config.get('URL_CLIENT'),
      });
    }

    return this.tokenService.generateAuthTokens({ id: user._id });
  }

  async signUp(signUpDto: SignUpRequestDto): Promise<StatusMessageDto> {
    const user = await this.usersRepository.findOne({ email: signUpDto.email });
    if (user) throw new EmailUsernameExistException();

    const newUser = await this.usersRepository.create({
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
    await this.usersRepository.updateOneById(userId, {
      hashedRefreshToken: null,
    });

    await this.userService.removeDevice(userId);
    return { message: 'Success' };
  }

  async refreshToken(userId: string, refreshToken: string): Promise<TokensDto> {
    const user = await this.usersRepository.findOneById(userId, {
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

    return this.tokenService.generateAuthTokens({ id: userId });
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<StatusMessageDto> {
    const resetToken = this.tokenService.generateResetPasswordToken();
    const user = await this.usersRepository.updateOne(
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
