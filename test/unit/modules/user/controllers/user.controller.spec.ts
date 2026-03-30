import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from 'src/modules/user/controllers/user.controller';
import { UserService } from 'src/modules/user/services/user.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    registerDevice: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerDevice', () => {
    it('should register device successfully', async () => {
      const jwtPayload = {
        id: 'user-id',
        email: 'test@test.com',
        iat: 123,
        exp: 456,
      };
      const body = { deviceId: 'device-123' };
      const expectedResult = { message: 'Success' };

      mockUserService.registerDevice.mockResolvedValue(expectedResult);

      const result = await controller.registerDevice(jwtPayload as any, body);

      expect(result).toEqual(expectedResult);
      expect(mockUserService.registerDevice).toHaveBeenCalledWith(
        'device-123',
        'user-id',
      );
    });
  });
});
