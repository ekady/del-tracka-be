import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UserProjectBulkRepository } from 'src/modules/user-project/repositories/user-project.bulk.repository';
import { UserProjectRepository } from 'src/modules/user-project/repositories/user-project.repository';
import { UserProjectService } from 'src/modules/user-project/services/user-project.service';
import { ERoleName } from 'src/shared/enums';
import { DocumentExistException } from 'src/shared/http-exceptions/exceptions';

describe('UserProjectService', () => {
  let service: UserProjectService;
  let userProjectRepository: UserProjectRepository;
  let userProjectBulkRepository: UserProjectBulkRepository;

  const mockUserProjectRepository = {
    aggregate: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    updateOne: jest.fn(),
    softDeleteOne: jest.fn(),
  };

  const mockUserProjectBulkRepository = {
    softDeleteManyById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserProjectService,
        { provide: UserProjectRepository, useValue: mockUserProjectRepository },
        {
          provide: UserProjectBulkRepository,
          useValue: mockUserProjectBulkRepository,
        },
      ],
    }).compile();

    service = module.get<UserProjectService>(UserProjectService);
    userProjectRepository = module.get<UserProjectRepository>(
      UserProjectRepository,
    );
    userProjectBulkRepository = module.get<UserProjectBulkRepository>(
      UserProjectBulkRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findUserProject', () => {
    it('should return user projects', async () => {
      const mockUserProjects = [
        {
          user: { _id: '665000000000000000000001', firstName: 'John' },
          project: { _id: '665000000000000000000002', name: 'Project 1' },
          role: { _id: '665000000000000000000003', name: ERoleName.OWNER },
          stages: [],
        },
      ];

      mockUserProjectRepository.aggregate.mockResolvedValue(mockUserProjects);

      const result = await service.findUserProject('665000000000000000000001');

      expect(result).toHaveLength(1);
      expect(result[0].project.name).toBe('Project 1');
    });
  });

  describe('findUserProjects', () => {
    it('should return a single user project', async () => {
      const mockUserProject = {
        user: { _id: '665000000000000000000001' },
        project: { _id: '665000000000000000000002', shortId: 'proj1' },
        role: { _id: '665000000000000000000003', name: ERoleName.OWNER },
        stages: [],
      };

      mockUserProjectRepository.aggregate.mockResolvedValue([mockUserProject]);

      const result = await service.findUserProjects(
        '665000000000000000000001',
        'proj1',
      );

      expect(result.project.shortId).toBe('proj1');
    });

    it('should throw BadRequestException when project not found', async () => {
      mockUserProjectRepository.aggregate.mockResolvedValue([]);

      await expect(
        service.findUserProjects('665000000000000000000001', 'non-existent'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('addUserProject', () => {
    it('should add a user to a project', async () => {
      const createUserProjectDto = {
        userId: 'user-id',
        projectId: 'project-id',
        roleId: 'role-id',
      };
      const mockUserProject = { _id: 'user-project-id' };

      mockUserProjectRepository.findOne.mockResolvedValue(null);
      mockUserProjectRepository.create.mockResolvedValue(mockUserProject);

      const result = await service.addUserProject(
        createUserProjectDto,
        'creator-id',
      );

      expect(result).toEqual(mockUserProject);
    });

    it('should throw DocumentExistException when user already exists on project', async () => {
      const createUserProjectDto = {
        userId: 'user-id',
        projectId: 'project-id',
        roleId: 'role-id',
      };

      mockUserProjectRepository.findOne.mockResolvedValue({
        _id: 'existing-id',
      });

      await expect(
        service.addUserProject(createUserProjectDto, 'creator-id'),
      ).rejects.toThrow(DocumentExistException);
    });
  });

  describe('updateUserProject', () => {
    it('should update user role in project', async () => {
      const updateUserProjectDto = {
        userId: '665000000000000000000001',
        projectId: '665000000000000000000002',
        roleId: '665000000000000000000004',
      };
      const mockUserProject = { _id: '665000000000000000000005' };

      mockUserProjectRepository.aggregate.mockResolvedValue([]);
      mockUserProjectRepository.findAll.mockResolvedValue({
        data: [{ _id: '665000000000000000000002' }],
      });
      mockUserProjectRepository.updateOne.mockResolvedValue(mockUserProject);

      const result = await service.updateUserProject(
        updateUserProjectDto,
        '665000000000000000000006',
      );

      expect(result).toEqual(mockUserProject);
    });

    it('should throw BadRequestException when removing last owner', async () => {
      const updateUserProjectDto = {
        userId: '665000000000000000000001',
        projectId: '665000000000000000000002',
        roleId: '665000000000000000000004',
      };
      const mockUserProject = [
        { role: { _id: '665000000000000000000003', name: ERoleName.OWNER } },
      ];

      mockUserProjectRepository.aggregate.mockResolvedValue(mockUserProject);
      mockUserProjectRepository.findAll.mockResolvedValue({
        data: [
          {
            _id: '665000000000000000000002',
            role: { _id: '665000000000000000000003' },
          },
        ],
      });

      await expect(
        service.updateUserProject(
          updateUserProjectDto,
          '665000000000000000000006',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteUserProject', () => {
    it('should remove user from project', async () => {
      const updateUserProjectDto = {
        userId: 'user-id',
        projectId: 'project-id',
      };
      const mockUserProject = {
        _id: 'user-project-id',
        role: { _id: 'role-id', name: ERoleName.DEVELOPER },
      };

      mockUserProjectRepository.findOne.mockResolvedValue(mockUserProject);
      mockUserProjectRepository.findAll.mockResolvedValue({
        data: [{ _id: 'user-project' }],
      });
      mockUserProjectRepository.softDeleteOne.mockResolvedValue({});

      const result = await service.deleteUserProject(updateUserProjectDto);

      expect(result).toEqual(mockUserProject);
    });

    it('should throw BadRequestException when removing only owner', async () => {
      const updateUserProjectDto = {
        userId: 'user-id',
        projectId: 'project-id',
      };
      const mockUserProject = {
        _id: 'user-project-id',
        role: { _id: 'role-id', name: ERoleName.OWNER },
      };

      mockUserProjectRepository.findOne.mockResolvedValue(mockUserProject);
      mockUserProjectRepository.findAll.mockResolvedValue({
        data: [{ _id: 'user-project' }],
      });

      await expect(
        service.deleteUserProject(updateUserProjectDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteAllUserProject', () => {
    it('should soft delete all user-project associations', async () => {
      const mockUserProjects = {
        data: [{ _id: 'user-project-1' }, { _id: 'user-project-2' }],
      };

      mockUserProjectRepository.findAll.mockResolvedValue(mockUserProjects);
      mockUserProjectBulkRepository.softDeleteManyById.mockResolvedValue(
        undefined,
      );

      await service.deleteAllUserProject('project-id');

      expect(
        mockUserProjectBulkRepository.softDeleteManyById,
      ).toHaveBeenCalledWith(['user-project-1', 'user-project-2']);
    });
  });
});
