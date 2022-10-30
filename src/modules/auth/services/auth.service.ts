import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusMessageDto } from 'src/common/dto';
import {
  CredentialInvalidException,
  EmailUsernameExistException,
  TokenInvalidException,
} from 'src/common/http-exceptions/exceptions';
import { UserEntity, UserDocument } from 'src/modules/users/schema/user.schema';
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
import { EmailService } from 'src/modules/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserEntity.name) private userSchema: Model<UserDocument>,
    private tokenService: TokenService,
    private emailService: EmailService,
    private config: ConfigService,
  ) {}

  async signIn(signInDto: SignInRequestDto): Promise<TokensDto> {
    const user = await this.userSchema
      .findOne({ email: signInDto.email })
      .select('+password')
      .exec();

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

    if (!userJwt || !userJwt.email || !userJwt.given_name)
      throw new TokenInvalidException();

    let user = await this.userSchema.findOne({ email: userJwt.email }).exec();

    if (!user) {
      user = await this.userSchema.create({
        email: userJwt.email,
        firstName: userJwt.given_name,
        lastName: userJwt.family_name,
        isViaProvider: true,
      });
      this.emailService.sendMail({
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
    const user = await this.userSchema
      .findOne({ email: signUpDto.email })
      .exec();
    if (user) throw new EmailUsernameExistException();

    const newUser = await this.userSchema.create({
      ...signUpDto,
      isViaProvider: false,
    });
    this.emailService.sendMail({
      to: newUser.email,
      subject: 'Welcome to Tracka Application',
      templateName: 'welcome',
      name: newUser.firstName,
      url: this.config.get('URL_CLIENT'),
    });

    return { message: 'Success' } as StatusMessageDto;
  }

  async signOut(userId: string): Promise<StatusMessageDto> {
    await this.userSchema
      .findByIdAndUpdate(userId, { hashedRefreshToken: null })
      .exec();
    return { message: 'Success' } as StatusMessageDto;
  }

  async refreshToken(userId: string, refreshToken: string): Promise<TokensDto> {
    const user = await this.userSchema
      .findById(userId)
      .select('+hashedRefreshToken')
      .exec();
    if (!user || !user.hashedRefreshToken) throw new TokenInvalidException();

    const isRefreshTokenMatch = await HashHelper.compare(
      refreshToken,
      user.hashedRefreshToken,
    );
    if (!isRefreshTokenMatch) throw new TokenInvalidException();

    return this.tokenService.generateAuthTokens({ id: userId });
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<StatusMessageDto> {
    const resetToken = this.tokenService.generateResetPasswordToken();
    const user = await this.userSchema
      .findOneAndUpdate(
        { email: forgotPasswordDto.email },
        {
          passwordResetToken: resetToken.hashedResetToken,
          passwordResetExpires: resetToken.expiresToken,
        },
      )
      .exec();
    if (user) {
      this.emailService.sendMail({
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

    return { message: 'Success' } as StatusMessageDto;
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

    this.emailService.sendMail({
      to: user.email,
      subject: 'Reset Password Successful',
      url: `${this.config.get('URL_CLIENT')}/auth/sign-in`,
      templateName: 'success-reset-password',
      name: user.firstName,
    });

    return { message: 'Success' };
  }
}
