import { Test, TestingModule } from '@nestjs/testing';

import { PermissionRepository } from 'src/modules/permission/repositories/permission.repository';
import { PermissionService } from 'src/modules/permission/services/permission.service';
import { DocumentNotFoundException } from 'src/shared/http-exceptions/exceptions';

describe('PermissionService', () => {
  let service: PermissionService;
  let permissionRepository: PermissionRepository;

  const mockPermissionRepository = {
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionService,
        { provide: PermissionRepository, useValue: mockPermissionRepository },
      ],
    }).compile();

    service = module.get<PermissionService>(PermissionService);
    permissionRepository =
      module.get<PermissionRepository>(PermissionRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all permissions', async () => {
      const mockPermissions = {
        data: [{ _id: 'perm-id', menu: 'project', role: { name: 'OWNER' } }],
      };

      mockPermissionRepository.findAll.mockResolvedValue(mockPermissions);

      const result = await service.findAll({ role: 'role-id' });

      expect(result).toHaveLength(1);
      expect(result[0].menu).toBe('project');
    });

    it('should throw DocumentNotFoundException when no permissions found', async () => {
      mockPermissionRepository.findAll.mockResolvedValue(null);

      await expect(service.findAll({})).rejects.toThrow(
        DocumentNotFoundException,
      );
    });
  });

  describe('findPermissions', () => {
    it('should return permissions grouped by role name', async () => {
      const mockPermissions = {
        data: [
          {
            _id: 'perm1',
            menu: 'project',
            role: { name: 'OWNER' },
            create: true,
            read: true,
            update: true,
            delete: true,
          },
          {
            _id: 'perm2',
            menu: 'task',
            role: { name: 'OWNER' },
            create: true,
            read: true,
            update: true,
            delete: true,
          },
        ],
      };

      mockPermissionRepository.findAll.mockResolvedValue(mockPermissions);

      const result = await service.findPermissions();

      expect(result.OWNER).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('should return a single permission', async () => {
      const mockPermission = {
        _id: 'perm-id',
        menu: 'project',
        role: { name: 'OWNER' },
      };

      mockPermissionRepository.findOne.mockResolvedValue(mockPermission);

      const result = await service.findOne({ _id: 'perm-id' });

      expect(result).toEqual(mockPermission);
    });

    it('should throw DocumentNotFoundException when permission not found', async () => {
      mockPermissionRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne({ _id: 'non-existent' })).rejects.toThrow(
        DocumentNotFoundException,
      );
    });
  });
});
