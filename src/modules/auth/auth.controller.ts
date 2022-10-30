import {
  Body,
  Controller,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResProperty } from 'src/common/decorators/api-res-property.decorator';
import { StatusMessageDto } from 'src/common/dto';
import { JwtPayloadReq, SkipAuth } from './decorators';
import {
  ContinueProviderRequestDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  SignInRequestDto,
  SignUpRequestDto,
  TokensDto,
} from './dto';
import { AuthJwtRefreshGuard } from './guard';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { VerifyResetDto } from './dto/verify-reset-payload.dto';
import { IJwtPayload } from './interfaces/jwt-payload.interface';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  @ApiResProperty(TokensDto, 200, { isDisableAuth: true })
  @SkipAuth()
  @HttpCode(200)
  signIn(@Body() body: SignInRequestDto): Promise<TokensDto> {
    return this.authService.signIn(body);
  }

  @Post('with-provider')
  @ApiResProperty(TokensDto, 200, { isDisableAuth: true })
  @SkipAuth()
  @HttpCode(200)
  continueWithProvider(
    @Body() providerDto: ContinueProviderRequestDto,
  ): Promise<TokensDto> {
    return this.authService.continueWithProvider(providerDto);
  }

  @Post('sign-up')
  @ApiResProperty(StatusMessageDto, 201, { isDisableAuth: true })
  @SkipAuth()
  async signUp(@Body() signUpDto: SignUpRequestDto): Promise<StatusMessageDto> {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign-out')
  @ApiResProperty(StatusMessageDto, 200)
  @HttpCode(200)
  signOut(@JwtPayloadReq() jwtPayload: IJwtPayload): Promise<StatusMessageDto> {
    return this.authService.signOut(jwtPayload.id);
  }

  @Post('refresh')
  @ApiResProperty(TokensDto, 200)
  @SkipAuth()
  @UseGuards(AuthJwtRefreshGuard)
  @HttpCode(200)
  refresh(
    @JwtPayloadReq() jwtPayload: IJwtPayload & Pick<TokensDto, 'refreshToken'>,
  ): Promise<TokensDto> {
    const { id, refreshToken } = jwtPayload;
    return this.authService.refreshToken(id, refreshToken);
  }

  @Post('forgot-password')
  @ApiResProperty(StatusMessageDto, 200, { isDisableAuth: true })
  @SkipAuth()
  @HttpCode(200)
  forgotPassword(@Body() body: ForgotPasswordDto): Promise<StatusMessageDto> {
    return this.authService.forgotPassword(body);
  }

  @Post('verify-reset-token')
  @ApiResProperty(StatusMessageDto, 200, { isDisableAuth: true })
  @SkipAuth()
  @HttpCode(200)
  verifyResetPasswordToken(
    @Body() body: VerifyResetDto,
  ): Promise<StatusMessageDto> {
    return this.authService.verifyTokenResetPassword(body.token);
  }

  @Post('reset-password')
  @ApiResProperty(StatusMessageDto, 200, { isDisableAuth: true })
  @SkipAuth()
  @HttpCode(200)
  resetPassword(
    @Query('reset-token') token: string,
    @Body() body: ResetPasswordDto,
  ): Promise<StatusMessageDto> {
    return this.authService.resetPassword(token, body);
  }
}
