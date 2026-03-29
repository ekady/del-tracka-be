import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AwsS3Service } from 'src/common/aws/services/aws.s3.service';
import { ProfileService } from 'src/modules/profile/services/profile.service';
import { UserRepository } from 'src/modules/user/repositories/user.repository';

describe('ProfileService', () => {
  let service: ProfileService;
  let userRepository: UserRepository;
  let awsS3Service: AwsS3Service;

  const mockUserRepository = {
    findOneById: jest.fn(),
    updateOneById: jest.fn(),
    softDeleteOneById: jest.fn(),
  };

  const mockAwsS3Service = {
    putItemInBucket: jest.fn(),
    deleteItemInBucket: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: AwsS3Service, useValue: mockAwsS3Service },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    userRepository = module.get<UserRepository>(UserRepository);
    awsS3Service = module.get<AwsS3Service>(AwsS3Service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findProfile', () => {
    it('should return user profile', async () => {
      const mockUser = {
        _id: 'user-id',
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        picture: 'picture-url',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        isDemo: false,
      };

      mockUserRepository.findOneById.mockResolvedValue(mockUser);

      const result = await service.findProfile('user-id');

      expect(result._id).toBe('user-id');
      expect(result.email).toBe('test@test.com');
      expect(result.firstName).toBe('John');
    });
  });

  describe('updateProfile', () => {
    it('should update profile without picture', async () => {
      const updateProfileDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@test.com',
        password: undefined,
        passwordConfirm: undefined,
      };
      const mockOldUser = {
        _id: 'user-id',
        picture: { completedPath: 'old-path' },
      };
      const mockUpdatedUser = {
        _id: 'user-id',
        email: 'jane@test.com',
        firstName: 'Jane',
        lastName: 'Doe',
        picture: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockUserRepository.findOneById.mockResolvedValueOnce(mockOldUser);
      mockAwsS3Service.deleteItemInBucket.mockResolvedValue(undefined);
      mockUserRepository.updateOneById.mockResolvedValue(mockUpdatedUser);

      const result = await service.updateProfile(
        'user-id',
        updateProfileDto as any,
      );

      expect(result.firstName).toBe('Jane');
    });

    it('should update profile with picture', async () => {
      const mockPicture = {
        buffer: Buffer.from('test'),
        originalname: 'test.png',
        mimetype: 'image/png',
        size: 1024,
      } as Express.Multer.File;
      const updateProfileDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@test.com',
        picture: mockPicture,
        password: undefined,
        passwordConfirm: undefined,
      };
      const mockOldUser = { _id: 'user-id', picture: null };
      const mockS3Result = { completedPath: 'new-path', filename: 'test.png' };
      const mockUpdatedUser = {
        _id: 'user-id',
        email: 'jane@test.com',
        firstName: 'Jane',
        lastName: 'Doe',
        picture: mockS3Result,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockUserRepository.findOneById.mockResolvedValueOnce(mockOldUser);
      mockAwsS3Service.putItemInBucket.mockResolvedValue(mockS3Result);
      mockUserRepository.updateOneById.mockResolvedValue(mockUpdatedUser);

      const result = await service.updateProfile(
        'user-id',
        updateProfileDto as any,
      );

      expect(result.firstName).toBe('Jane');
      expect(mockAwsS3Service.putItemInBucket).toHaveBeenCalled();
    });
  });

  describe('deleteProfile', () => {
    it('should delete profile successfully', async () => {
      const mockUser = { _id: 'user-id', isDemo: false };

      mockUserRepository.findOneById.mockResolvedValue(mockUser);
      mockUserRepository.softDeleteOneById.mockResolvedValue({});

      const result = await service.deleteProfile('user-id');

      expect(result).toEqual({ message: 'Success' });
    });

    it('should throw BadRequestException when trying to delete demo account', async () => {
      const mockUser = { _id: 'user-id', isDemo: true };

      mockUserRepository.findOneById.mockResolvedValue(mockUser);

      await expect(service.deleteProfile('user-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
