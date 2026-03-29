import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { ETokenJwtConfig } from 'src/modules/auth/enum';
import { TokenService } from 'src/modules/auth/services/token.service';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { HashHelper } from 'src/shared/helpers';
import {
  AccessTokenExpiredException,
  CredentialInvalidException,
  RefreshTokenExpiredException,
} from 'src/shared/http-exceptions/exceptions';

jest.mock('src/shared/helpers', () => ({
  HashHelper: {
    encrypt: jest.fn(),
  },
}));

jest.mock('crypto', () => ({
  randomBytes: jest
    .fn()
    .mockReturnValue({ toString: jest.fn().mockReturnValue('random-hex') }),
  createHash: jest.fn().mockReturnValue({
    update: jest.fn().mockReturnValue({
      digest: jest.fn().mockReturnValue('hashed-token'),
    }),
  }),
}));

describe('TokenService', () => {
  let service: TokenService;
  let userRepository: UserRepository;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUserRepository = {
    updateOneById: jest.fn(),
    findOneById: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateAuthTokens', () => {
    it('should generate access and refresh tokens', async () => {
      const payload = { id: 'user-id', email: 'test@test.com' };

      mockJwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');
      mockConfigService.get
        .mockReturnValueOnce('1h')
        .mockReturnValueOnce('secret')
        .mockReturnValueOnce('7d')
        .mockReturnValueOnce('refresh-secret')
        .mockReturnValueOnce('Bearer');
      (HashHelper.encrypt as jest.Mock).mockResolvedValue(
        'hashed-refresh-token',
      );
      mockUserRepository.updateOneById.mockResolvedValue({});

      const result = await service.generateAuthTokens(payload);

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        tokenType: 'Bearer',
      });
    });

    it('should throw CredentialInvalidException when update fails', async () => {
      const payload = { id: 'user-id', email: 'test@test.com' };

      mockJwtService.sign.mockReturnValue('token');
      mockConfigService.get.mockReturnValue('config-value');
      (HashHelper.encrypt as jest.Mock).mockResolvedValue('hashed-token');
      mockUserRepository.updateOneById.mockRejectedValue(
        new Error('Update failed'),
      );

      await expect(service.generateAuthTokens(payload)).rejects.toThrow(
        CredentialInvalidException,
      );
    });
  });

  describe('validateTokenUser', () => {
    it('should return user payload when user exists', async () => {
      const payload = {
        id: 'user-id',
        email: 'test@test.com',
        iat: 123,
        exp: 456,
      };
      const mockUser = { _id: 'user-id' };

      mockUserRepository.findOneById.mockResolvedValue(mockUser);

      const result = await service.validateTokenUser(payload as any);

      expect(result).toEqual(payload);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      const payload = {
        id: 'user-id',
        email: 'test@test.com',
        iat: 123,
        exp: 456,
      };

      mockUserRepository.findOneById.mockResolvedValue(null);

      await expect(service.validateTokenUser(payload as any)).rejects.toThrow();
    });
  });

  describe('verifyToken', () => {
    it('should return decoded token on success', () => {
      const decodedToken = { id: 'user-id', email: 'test@test.com' };
      mockJwtService.verify.mockReturnValue(decodedToken);
      mockConfigService.get.mockReturnValue('secret');

      const result = service.verifyToken(
        'valid-token',
        ETokenJwtConfig.AccessToken,
      );

      expect(result).toEqual(decodedToken);
    });

    it('should throw AccessTokenExpiredException for expired access token', () => {
      mockJwtService.verify.mockImplementation(() => {
        const error = new Error('Token expired');
        error.name = 'TokenExpiredError';
        throw error;
      });
      mockConfigService.get.mockReturnValue('secret');

      expect(() =>
        service.verifyToken('expired-token', ETokenJwtConfig.AccessToken),
      ).toThrow(AccessTokenExpiredException);
    });

    it('should throw RefreshTokenExpiredException for expired refresh token', () => {
      mockJwtService.verify
        .mockImplementationOnce(() => {
          const error = new Error('Token expired');
          error.name = 'TokenExpiredError';
          throw error;
        })
        .mockReturnValueOnce({ id: 'user-id' });
      mockConfigService.get.mockReturnValue('secret');
      mockUserRepository.updateOneById.mockResolvedValue({});

      expect(() =>
        service.verifyToken('expired-token', ETokenJwtConfig.RefreshToken),
      ).toThrow(RefreshTokenExpiredException);
    });
  });

  describe('generateResetPasswordToken', () => {
    it('should generate reset password token', () => {
      const result = service.generateResetPasswordToken();

      expect(result).toHaveProperty('resetToken');
      expect(result).toHaveProperty('hashedResetToken');
      expect(result).toHaveProperty('expiresToken');
    });
  });

  describe('verifyResetPasswordToken', () => {
    it('should return user when token is valid', async () => {
      const mockUser = { _id: 'user-id' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.verifyResetPasswordToken('valid-token');

      expect(result).toEqual(mockUser);
    });
  });
});
