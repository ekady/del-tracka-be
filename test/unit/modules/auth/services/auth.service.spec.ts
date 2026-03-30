import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AwsS3Service } from 'src/common/aws/services/aws.s3.service';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { TokenService } from 'src/modules/auth/services/token.service';
import { EmailService } from 'src/modules/email/services/email.service';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { UserService } from 'src/modules/user/services/user.service';
import { HashHelper } from 'src/shared/helpers';
import {
  CredentialInvalidException,
  EmailUsernameExistException,
  TokenInvalidException,
} from 'src/shared/http-exceptions/exceptions';

jest.mock('src/shared/helpers', () => ({
  HashHelper: {
    compare: jest.fn(),
    hashCrypto: jest.fn(),
  },
}));

jest.mock('axios', () => ({
  get: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: UserRepository;
  let tokenService: TokenService;
  let emailService: EmailService;
  let awsS3Service: AwsS3Service;
  let configService: ConfigService;
  let userService: UserService;

  const mockUserRepository = {
    findOne: jest.fn(),
    findOneById: jest.fn(),
    create: jest.fn(),
    updateOneById: jest.fn(),
    updateOne: jest.fn(),
  };

  const mockTokenService = {
    generateAuthTokens: jest.fn(),
    generateResetPasswordToken: jest.fn(),
    verifyResetPasswordToken: jest.fn(),
    verifyGoogleIdToken: jest.fn(),
  };

  const mockEmailService = {
    sendMail: jest.fn(),
  };

  const mockAwsS3Service = {
    putItemInBucket: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockUserService = {
    removeDevice: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: TokenService, useValue: mockTokenService },
        { provide: EmailService, useValue: mockEmailService },
        { provide: AwsS3Service, useValue: mockAwsS3Service },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    tokenService = module.get<TokenService>(TokenService);
    emailService = module.get<EmailService>(EmailService);
    awsS3Service = module.get<AwsS3Service>(AwsS3Service);
    configService = module.get<ConfigService>(ConfigService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should return tokens on successful sign in', async () => {
      const signInDto = { email: 'test@test.com', password: 'password123' };
      const mockUser = {
        _id: 'user-id',
        email: 'test@test.com',
        password: 'hashedPassword',
      };
      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        tokenType: 'Bearer',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (HashHelper.compare as jest.Mock).mockResolvedValue(true);
      mockTokenService.generateAuthTokens.mockResolvedValue(mockTokens);

      const result = await service.signIn(signInDto);

      expect(result).toEqual(mockTokens);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith(
        { email: signInDto.email },
        { select: { password: 1, email: 1, picture: 1 } },
      );
    });

    it('should throw CredentialInvalidException when user not found', async () => {
      const signInDto = { email: 'test@test.com', password: 'password123' };

      mockUserRepository.findOne.mockResolvedValue(null);
      (HashHelper.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        CredentialInvalidException,
      );
    });

    it('should throw CredentialInvalidException when password is incorrect', async () => {
      const signInDto = { email: 'test@test.com', password: 'wrongpassword' };
      const mockUser = {
        _id: 'user-id',
        email: 'test@test.com',
        password: 'hashedPassword',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (HashHelper.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        CredentialInvalidException,
      );
    });
  });

  describe('signUp', () => {
    it('should create a new user and return success message', async () => {
      const signUpDto = {
        email: 'new@test.com',
        password: 'password123',
        passwordConfirm: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };
      const mockUser = { _id: 'user-id', ...signUpDto };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockUser);
      mockConfigService.get.mockReturnValue('https://gravatar.com');
      mockEmailService.sendMail.mockResolvedValue(undefined);

      const result = await service.signUp(signUpDto);

      expect(result).toEqual({ message: 'Success' });
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockEmailService.sendMail).toHaveBeenCalled();
    });

    it('should throw EmailUsernameExistException when email already exists', async () => {
      const signUpDto = {
        email: 'existing@test.com',
        password: 'password123',
        passwordConfirm: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockUserRepository.findOne.mockResolvedValue({ _id: 'existing-user' });

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        EmailUsernameExistException,
      );
    });
  });

  describe('signOut', () => {
    it('should sign out user and return success message', async () => {
      mockUserRepository.updateOneById.mockResolvedValue({});

      const result = await service.signOut('user-id');

      expect(result).toEqual({ message: 'Success' });
      expect(mockUserRepository.updateOneById).toHaveBeenCalledWith('user-id', {
        hashedRefreshToken: null,
        deviceId: null,
      });
    });
  });

  describe('refreshToken', () => {
    it('should return new tokens on successful refresh', async () => {
      const mockUser = {
        _id: 'user-id',
        email: 'test@test.com',
        hashedRefreshToken: 'hashed-token',
      };
      const mockTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        tokenType: 'Bearer',
      };

      mockUserRepository.findOneById.mockResolvedValue(mockUser);
      (HashHelper.compare as jest.Mock).mockResolvedValue(true);
      mockTokenService.generateAuthTokens.mockResolvedValue(mockTokens);

      const result = await service.refreshToken('user-id', 'refresh-token');

      expect(result).toEqual(mockTokens);
    });

    it('should throw TokenInvalidException when user has no refresh token', async () => {
      mockUserRepository.findOneById.mockResolvedValue({
        _id: 'user-id',
        hashedRefreshToken: null,
      });

      await expect(
        service.refreshToken('user-id', 'refresh-token'),
      ).rejects.toThrow(TokenInvalidException);
    });

    it('should throw TokenInvalidException when refresh token does not match', async () => {
      const mockUser = {
        _id: 'user-id',
        hashedRefreshToken: 'hashed-token',
      };

      mockUserRepository.findOneById.mockResolvedValue(mockUser);
      (HashHelper.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.refreshToken('user-id', 'wrong-token'),
      ).rejects.toThrow(TokenInvalidException);
    });
  });

  describe('forgotPassword', () => {
    it('should send reset password email', async () => {
      const forgotPasswordDto = { email: 'test@test.com' };
      const mockUser = {
        _id: 'user-id',
        email: 'test@test.com',
        firstName: 'John',
      };
      const mockResetToken = {
        resetToken: 'reset-token',
        hashedResetToken: 'hashed-reset-token',
        expiresToken: Date.now() + 3600000,
      };

      mockTokenService.generateResetPasswordToken.mockReturnValue(
        mockResetToken,
      );
      mockUserRepository.updateOne.mockResolvedValue(mockUser);
      mockConfigService.get.mockReturnValue('https://client.com');
      mockEmailService.sendMail.mockResolvedValue(undefined);

      const result = await service.forgotPassword(forgotPasswordDto);

      expect(result).toEqual({ message: 'Success' });
      expect(mockEmailService.sendMail).toHaveBeenCalled();
    });
  });

  describe('verifyTokenResetPassword', () => {
    it('should return success when token is valid', async () => {
      const mockUser = { _id: 'user-id' };
      mockTokenService.verifyResetPasswordToken.mockResolvedValue(mockUser);

      const result = await service.verifyTokenResetPassword('valid-token');

      expect(result).toEqual({ message: 'Success' });
    });

    it('should throw TokenInvalidException when token is invalid', async () => {
      mockTokenService.verifyResetPasswordToken.mockResolvedValue(null);

      await expect(
        service.verifyTokenResetPassword('invalid-token'),
      ).rejects.toThrow(TokenInvalidException);
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const resetPasswordDto = {
        password: 'newPassword',
        passwordConfirm: 'newPassword',
      };
      const mockUser = {
        _id: 'user-id',
        email: 'test@test.com',
        firstName: 'John',
        save: jest.fn().mockResolvedValue(true),
      };

      mockTokenService.verifyResetPasswordToken.mockResolvedValue(mockUser);
      mockConfigService.get.mockReturnValue('https://client.com');
      mockEmailService.sendMail.mockResolvedValue(undefined);

      const result = await service.resetPassword(
        'valid-token',
        resetPasswordDto,
      );

      expect(result).toEqual({ message: 'Success' });
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should throw TokenInvalidException when token is invalid', async () => {
      mockTokenService.verifyResetPasswordToken.mockResolvedValue(null);

      await expect(
        service.resetPassword('invalid-token', {
          password: 'newPassword',
          passwordConfirm: 'newPassword',
        }),
      ).rejects.toThrow(TokenInvalidException);
    });
  });
});
