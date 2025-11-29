import { Test, TestingModule } from '@nestjs/testing';

import { RoleRepository } from 'src/modules/role/repositories/role.repository';
import { RoleService } from 'src/modules/role/services/role.service';
import { UserProjectService } from 'src/modules/user-project/services/user-project.service';
import { ERoleName } from 'src/shared/enums';
import { DocumentNotFoundException } from 'src/shared/http-exceptions/exceptions';

describe('RoleService', () => {
  let service: RoleService;
  let roleRepository: RoleRepository;
  let userProjectService: UserProjectService;

  const mockRoleRepository = {
    findOne: jest.fn(),
  };

  const mockUserProjectService = {
    findUserProjectByRoleId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        { provide: RoleRepository, useValue: mockRoleRepository },
        { provide: UserProjectService, useValue: mockUserProjectService },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    roleRepository = module.get<RoleRepository>(RoleRepository);
    userProjectService = module.get<UserProjectService>(UserProjectService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOneRole', () => {
    it('should return role when found', async () => {
      const mockRole = { _id: 'role-id', name: ERoleName.OWNER };
      mockRoleRepository.findOne.mockResolvedValue(mockRole);

      const result = await service.findOneRole({ name: ERoleName.OWNER });

      expect(result).toEqual(mockRole);
    });

    it('should throw DocumentNotFoundException when role not found', async () => {
      mockRoleRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findOneRole({ name: ERoleName.OWNER }),
      ).rejects.toThrow(DocumentNotFoundException);
    });
  });

  describe('findProjectOwners', () => {
    it('should return project owners', async () => {
      const mockRole = { _id: 'role-id', name: ERoleName.OWNER };
      const mockOwners = [{ _id: 'user-project-id', user: { _id: 'user-id' } }];

      mockRoleRepository.findOne.mockResolvedValue(mockRole);
      mockUserProjectService.findUserProjectByRoleId.mockResolvedValue(
        mockOwners,
      );

      const result = await service.findProjectOwners('project-id');

      expect(result).toEqual(mockOwners);
    });
  });

  describe('findProjectOwner', () => {
    it('should return first owner user id', async () => {
      const mockRole = { _id: 'role-id', name: ERoleName.OWNER };
      const mockOwners = [{ _id: 'user-project-id', user: { _id: 'user-id' } }];

      mockRoleRepository.findOne.mockResolvedValue(mockRole);
      mockUserProjectService.findUserProjectByRoleId.mockResolvedValue(
        mockOwners,
      );

      const result = await service.findProjectOwner('project-id');

      expect(result).toBe('user-id');
    });
  });
});
