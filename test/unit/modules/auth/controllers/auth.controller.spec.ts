import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from 'src/modules/auth/controllers/auth.controller';
import { AuthService } from 'src/modules/auth/services/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    refreshToken: jest.fn(),
    forgotPassword: jest.fn(),
    verifyTokenResetPassword: jest.fn(),
    resetPassword: jest.fn(),
    continueWithProvider: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should call authService.signIn with correct params', async () => {
      const signInDto = { email: 'test@test.com', password: 'password123' };
      const mockTokens = {
        accessToken: 'access',
        refreshToken: 'refresh',
        tokenType: 'Bearer',
      };

      mockAuthService.signIn.mockResolvedValue(mockTokens);

      const result = await controller.signIn(signInDto);

      expect(result).toEqual(mockTokens);
      expect(mockAuthService.signIn).toHaveBeenCalledWith(signInDto);
    });
  });

  describe('signUp', () => {
    it('should call authService.signUp with correct params', async () => {
      const signUpDto = {
        email: 'test@test.com',
        password: 'password123',
        passwordConfirm: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };
      const mockResponse = { message: 'Success' as const };

      mockAuthService.signUp.mockResolvedValue(mockResponse);

      const result = await controller.signUp(signUpDto);

      expect(result).toEqual(mockResponse);
      expect(mockAuthService.signUp).toHaveBeenCalledWith(signUpDto);
    });
  });

  describe('signOut', () => {
    it('should call authService.signOut with user id', async () => {
      const jwtPayload = {
        id: 'user-id',
        email: 'test@test.com',
        iat: 123,
        exp: 456,
      };
      const mockResponse = { message: 'Success' as const };

      mockAuthService.signOut.mockResolvedValue(mockResponse);

      const result = await controller.signOut(jwtPayload as any);

      expect(result).toEqual(mockResponse);
      expect(mockAuthService.signOut).toHaveBeenCalledWith('user-id');
    });
  });

  describe('refresh', () => {
    it('should call authService.refreshToken with correct params', async () => {
      const jwtPayload = {
        id: 'user-id',
        email: 'test@test.com',
        iat: 123,
        exp: 456,
        refreshToken: 'refresh-token',
      };
      const mockTokens = {
        accessToken: 'new-access',
        refreshToken: 'new-refresh',
        tokenType: 'Bearer',
      };

      mockAuthService.refreshToken.mockResolvedValue(mockTokens);

      const result = await controller.refresh(jwtPayload as any);

      expect(result).toEqual(mockTokens);
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(
        'user-id',
        'refresh-token',
      );
    });
  });

  describe('forgotPassword', () => {
    it('should call authService.forgotPassword with correct params', async () => {
      const forgotPasswordDto = { email: 'test@test.com' };
      const mockResponse = { message: 'Success' as const };

      mockAuthService.forgotPassword.mockResolvedValue(mockResponse);

      const result = await controller.forgotPassword(forgotPasswordDto);

      expect(result).toEqual(mockResponse);
      expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(
        forgotPasswordDto,
      );
    });
  });

  describe('verifyResetPasswordToken', () => {
    it('should call authService.verifyTokenResetPassword with correct params', async () => {
      const mockResponse = { message: 'Success' as const };

      mockAuthService.verifyTokenResetPassword.mockResolvedValue(mockResponse);

      const result = await controller.verifyResetPasswordToken('reset-token');

      expect(result).toEqual(mockResponse);
      expect(mockAuthService.verifyTokenResetPassword).toHaveBeenCalledWith(
        'reset-token',
      );
    });
  });

  describe('resetPassword', () => {
    it('should call authService.resetPassword with correct params', async () => {
      const resetPasswordDto = {
        password: 'newPassword',
        passwordConfirm: 'newPassword',
      };
      const mockResponse = { message: 'Success' as const };

      mockAuthService.resetPassword.mockResolvedValue(mockResponse);

      const result = await controller.resetPassword(
        'reset-token',
        resetPasswordDto,
      );

      expect(result).toEqual(mockResponse);
      expect(mockAuthService.resetPassword).toHaveBeenCalledWith(
        'reset-token',
        resetPasswordDto,
      );
    });
  });
});
