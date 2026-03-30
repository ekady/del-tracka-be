import { Test, TestingModule } from '@nestjs/testing';

import { ProfileController } from 'src/modules/profile/controllers/profile.controller';
import { ProfileService } from 'src/modules/profile/services/profile.service';

describe('ProfileController', () => {
  let controller: ProfileController;
  let profileService: ProfileService;

  const mockProfileService = {
    findProfile: jest.fn(),
    updateProfile: jest.fn(),
    deleteProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [{ provide: ProfileService, useValue: mockProfileService }],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    profileService = module.get<ProfileService>(ProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const jwtPayload = {
        id: 'user-id',
        email: 'test@test.com',
        iat: 123,
        exp: 456,
      };
      const mockProfile = {
        _id: 'user-id',
        email: 'test@test.com',
        firstName: 'John',
      };

      mockProfileService.findProfile.mockResolvedValue(mockProfile);

      const result = await controller.getProfile(jwtPayload);

      expect(result).toEqual(mockProfile);
      expect(mockProfileService.findProfile).toHaveBeenCalledWith('user-id');
    });
  });

  describe('update', () => {
    it('should update user profile', async () => {
      const jwtPayload = {
        id: 'user-id',
        email: 'test@test.com',
        iat: 123,
        exp: 456,
      };
      const body = { firstName: 'Jane' };
      const mockProfile = { _id: 'user-id', firstName: 'Jane' };

      mockProfileService.updateProfile.mockResolvedValue(mockProfile);

      const result = await controller.update(jwtPayload, null, body as any);

      expect(result).toEqual(mockProfile);
    });
  });

  describe('remove', () => {
    it('should delete user profile', async () => {
      const jwtPayload = {
        id: 'user-id',
        email: 'test@test.com',
        iat: 123,
        exp: 456,
      };

      mockProfileService.deleteProfile.mockResolvedValue({
        message: 'Success',
      });

      const result = await controller.remove(jwtPayload);

      expect(result).toEqual({ message: 'Success' });
      expect(mockProfileService.deleteProfile).toHaveBeenCalledWith('user-id');
    });
  });
});
