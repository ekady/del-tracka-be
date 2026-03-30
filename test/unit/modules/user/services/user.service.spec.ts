import { Test, TestingModule } from '@nestjs/testing';

import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { UserService } from 'src/modules/user/services/user.service';
import { DocumentNotFoundException } from 'src/shared/http-exceptions/exceptions';

describe('UserService', () => {
  let service: UserService;
  let userRepository: UserRepository;

  const mockUserRepository = {
    findOneById: jest.fn(),
    findOne: jest.fn(),
    updateOneById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return a user when found', async () => {
      const mockUser = { _id: 'user-id', email: 'test@test.com' };
      mockUserRepository.findOneById.mockResolvedValue(mockUser);

      const result = await service.findOne('user-id');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOneById).toHaveBeenCalledWith('user-id');
    });

    it('should throw DocumentNotFoundException when user not found', async () => {
      mockUserRepository.findOneById.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        DocumentNotFoundException,
      );
    });

    it('should throw custom error message when provided', async () => {
      mockUserRepository.findOneById.mockResolvedValue(null);

      await expect(
        service.findOne('non-existent-id', 'Custom error'),
      ).rejects.toThrow('Custom error');
    });
  });

  describe('findByEmail', () => {
    it('should return a user when found by email', async () => {
      const mockUser = { _id: 'user-id', email: 'test@test.com' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@test.com');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        email: 'test@test.com',
      });
    });

    it('should throw DocumentNotFoundException when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findByEmail('nonexistent@test.com')).rejects.toThrow(
        DocumentNotFoundException,
      );
    });
  });

  describe('registerDevice', () => {
    it('should register device and return success message', async () => {
      const mockUser = { _id: 'user-id', deviceId: 'device-123' };
      mockUserRepository.updateOneById.mockResolvedValue(mockUser);

      const result = await service.registerDevice('device-123', 'user-id');

      expect(result).toEqual({ message: 'Success' });
      expect(mockUserRepository.updateOneById).toHaveBeenCalledWith('user-id', {
        deviceId: 'device-123',
      });
    });

    it('should throw DocumentNotFoundException when user not found', async () => {
      mockUserRepository.updateOneById.mockResolvedValue(null);

      await expect(
        service.registerDevice('device-123', 'non-existent-id'),
      ).rejects.toThrow(DocumentNotFoundException);
    });
  });

  describe('removeDevice', () => {
    it('should remove device and return success message', async () => {
      const mockUser = { _id: 'user-id', deviceId: null };
      mockUserRepository.updateOneById.mockResolvedValue(mockUser);

      const result = await service.removeDevice('user-id');

      expect(result).toEqual({ message: 'Success' });
      expect(mockUserRepository.updateOneById).toHaveBeenCalledWith('user-id', {
        deviceId: null,
      });
    });

    it('should throw DocumentNotFoundException when user not found', async () => {
      mockUserRepository.updateOneById.mockResolvedValue(null);

      await expect(service.removeDevice('non-existent-id')).rejects.toThrow(
        DocumentNotFoundException,
      );
    });
  });
});
