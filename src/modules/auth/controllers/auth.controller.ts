import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiResProperty } from 'src/common/decorators/api-res-property.decorator';
import { StatusMessageDto } from 'src/common/dto';
import { JwtPayloadReq, SkipAuth } from '../decorators';
import {
  ContinueProviderRequestDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  SignInRequestDto,
  SignUpRequestDto,
  TokensDto,
} from '../dto';
import { AuthJwtRefreshGuard } from '../guard';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  @Throttle(5, 3600)
  @ApiResProperty(TokensDto, 200, { isDisableAuth: true })
  @SkipAuth()
  @HttpCode(200)
  signIn(@Body() body: SignInRequestDto): Promise<TokensDto> {
    return this.authService.signIn(body);
  }

  @Post('with-provider')
  @Throttle(5, 3600)
  @ApiResProperty(TokensDto, 200, { isDisableAuth: true })
  @SkipAuth()
  @HttpCode(200)
  continueWithProvider(
    @Body() providerDto: ContinueProviderRequestDto,
  ): Promise<TokensDto> {
    return this.authService.continueWithProvider(providerDto);
  }

  @Post('sign-up')
  @Throttle(5, 3600)
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
  @Throttle(5, 3600)
  @ApiResProperty(StatusMessageDto, 200, { isDisableAuth: true })
  @SkipAuth()
  @HttpCode(200)
  forgotPassword(@Body() body: ForgotPasswordDto): Promise<StatusMessageDto> {
    return this.authService.forgotPassword(body);
  }

  @Get('verify-reset-token')
  @Throttle(5, 3600)
  @ApiResProperty(StatusMessageDto, 200, { isDisableAuth: true })
  @SkipAuth()
  @HttpCode(200)
  verifyResetPasswordToken(
    @Query('token') token: string,
  ): Promise<StatusMessageDto> {
    return this.authService.verifyTokenResetPassword(token);
  }

  @Post('reset-password')
  @Throttle(5, 3600)
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
