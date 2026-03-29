import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ActivityService } from 'src/modules/activity/services/activity.service';
import { PermissionService } from 'src/modules/permission/services/permission.service';
import { ProjectRepository } from 'src/modules/project/repositories/project.repository';
import { ProjectHelperService } from 'src/modules/project/services/project-helper.service';
import { ProjectService } from 'src/modules/project/services/project.service';
import { RoleService } from 'src/modules/role/services/role.service';
import { UserProjectService } from 'src/modules/user-project/services/user-project.service';
import { ERoleName } from 'src/shared/enums';
import { DocumentNotFoundException } from 'src/shared/http-exceptions/exceptions';

describe('ProjectService', () => {
  let service: ProjectService;
  let projectRepository: ProjectRepository;
  let projectHelperService: ProjectHelperService;
  let userProjectService: UserProjectService;
  let roleService: RoleService;
  let activityService: ActivityService;
  let permissionService: PermissionService;

  const mockProjectRepository = {
    create: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn(),
    softDeleteOne: jest.fn(),
  };

  const mockProjectHelperService = {
    findProjectById: jest.fn(),
    findProjectByShortId: jest.fn(),
  };

  const mockUserProjectService = {
    findUserProject: jest.fn(),
    findUserProjects: jest.fn(),
    addUserProject: jest.fn(),
    deleteAllUserProject: jest.fn(),
  };

  const mockRoleService = {
    findOneRole: jest.fn(),
  };

  const mockActivityService = {
    findActivityByProjectId: jest.fn(),
  };

  const mockPermissionService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        { provide: ProjectRepository, useValue: mockProjectRepository },
        { provide: ProjectHelperService, useValue: mockProjectHelperService },
        { provide: UserProjectService, useValue: mockUserProjectService },
        { provide: RoleService, useValue: mockRoleService },
        { provide: ActivityService, useValue: mockActivityService },
        { provide: PermissionService, useValue: mockPermissionService },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    projectRepository = module.get<ProjectRepository>(ProjectRepository);
    projectHelperService =
      module.get<ProjectHelperService>(ProjectHelperService);
    userProjectService = module.get<UserProjectService>(UserProjectService);
    roleService = module.get<RoleService>(RoleService);
    activityService = module.get<ActivityService>(ActivityService);
    permissionService = module.get<PermissionService>(PermissionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a project successfully', async () => {
      const createProjectDto = {
        name: 'Test Project',
        description: 'Test Description',
      };
      const mockRole = { _id: 'role-id', name: ERoleName.OWNER };
      const mockProject = { _id: 'project-id', name: 'Test Project' };

      mockRoleService.findOneRole.mockResolvedValue(mockRole);
      mockProjectRepository.create.mockResolvedValue(mockProject);
      mockUserProjectService.addUserProject.mockResolvedValue({});

      const result = await service.create('user-id', createProjectDto);

      expect(result).toEqual({ message: 'Success' });
      expect(mockProjectRepository.create).toHaveBeenCalled();
      expect(mockUserProjectService.addUserProject).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all projects for a user', async () => {
      const mockUserProjects = [
        {
          project: {
            _id: 'project-id',
            name: 'Project 1',
            description: 'Desc',
            shortId: 'proj1',
          },
          role: {
            name: ERoleName.OWNER,
            permissions: [
              {
                menu: 'project',
                read: true,
                create: true,
                update: true,
                delete: true,
              },
            ],
          },
          stages: [],
        },
      ];

      mockUserProjectService.findUserProject.mockResolvedValue(
        mockUserProjects,
      );

      const result = await service.findAll('user-id');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Project 1');
      expect(result[0].role).toBe(ERoleName.OWNER);
    });
  });

  describe('findOne', () => {
    it('should return a single project', async () => {
      const mockUserProject = {
        project: {
          _id: 'project-id',
          name: 'Project 1',
          description: 'Desc',
          shortId: 'proj1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        role: { _id: 'role-id', name: ERoleName.OWNER },
        stages: [],
      };
      const mockPermissions = [
        {
          menu: 'project',
          create: true,
          read: true,
          update: true,
          delete: true,
        },
      ];

      mockUserProjectService.findUserProjects.mockResolvedValue(
        mockUserProject,
      );
      mockPermissionService.findAll.mockResolvedValue(mockPermissions);

      const result = await service.findOne('proj1', 'user-id');

      expect(result.name).toBe('Project 1');
      expect(result.role).toBe(ERoleName.OWNER);
    });
  });

  describe('update', () => {
    it('should update a project successfully', async () => {
      const updateProjectDto = { name: 'Updated Project' };
      const mockProject = { _id: 'project-id', name: 'Updated Project' };

      mockProjectRepository.updateOne.mockResolvedValue(mockProject);

      const result = await service.update('user-id', 'proj1', updateProjectDto);

      expect(result).toEqual({ message: 'Success' });
    });

    it('should throw DocumentNotFoundException when project not found', async () => {
      mockProjectRepository.updateOne.mockResolvedValue(null);

      await expect(
        service.update('user-id', 'proj1', { name: 'Updated' }),
      ).rejects.toThrow(DocumentNotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a project successfully', async () => {
      const mockProject = {
        _id: 'project-id',
        shortId: 'proj1',
        isDemo: false,
      };
      const mockDeletedProject = { _id: 'project-id' };

      mockProjectRepository.findOne.mockResolvedValue(mockProject);
      mockProjectRepository.softDeleteOne.mockResolvedValue(mockDeletedProject);
      mockUserProjectService.deleteAllUserProject.mockResolvedValue(undefined);

      const result = await service.remove('proj1');

      expect(result).toEqual({ message: 'Success' });
    });

    it('should throw BadRequestException when trying to remove demo project', async () => {
      const mockProject = { _id: 'project-id', shortId: 'proj1', isDemo: true };

      mockProjectRepository.findOne.mockResolvedValue(mockProject);

      await expect(service.remove('proj1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findActivity', () => {
    it('should return project activities', async () => {
      const mockProject = { _id: 'project-id' };
      const mockActivities = {
        data: [],
        pagination: { limit: 10, page: 1, total: 0, totalPages: 0 },
      };

      mockProjectHelperService.findProjectByShortId.mockResolvedValue(
        mockProject,
      );
      mockActivityService.findActivityByProjectId.mockResolvedValue(
        mockActivities,
      );

      const result = await service.findActivity('proj1', {
        limit: 10,
        page: 1,
      } as any);

      expect(result).toEqual(mockActivities);
    });
  });
});
