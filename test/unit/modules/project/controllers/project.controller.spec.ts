import { Test, TestingModule } from '@nestjs/testing';

import { ProjectController } from 'src/modules/project/controllers/project.controller';
import { ProjectService } from 'src/modules/project/services/project.service';

describe('ProjectController', () => {
  let controller: ProjectController;
  let projectService: ProjectService;

  const mockProjectService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findActivity: jest.fn(),
    getActivityPdf: jest.fn(),
    getActivityExcel: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [{ provide: ProjectService, useValue: mockProjectService }],
    }).compile();

    controller = module.get<ProjectController>(ProjectController);
    projectService = module.get<ProjectService>(ProjectService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a project', async () => {
      const jwtPayload = {
        id: 'user-id',
        email: 'test@test.com',
        iat: 123,
        exp: 456,
      };
      const createProjectDto = { name: 'Test Project', description: 'Test' };

      mockProjectService.create.mockResolvedValue({ message: 'Success' });

      const result = await controller.create(
        jwtPayload as any,
        createProjectDto,
      );

      expect(result).toEqual({ message: 'Success' });
      expect(mockProjectService.create).toHaveBeenCalledWith(
        'user-id',
        createProjectDto,
      );
    });
  });

  describe('findAll', () => {
    it('should return all projects', async () => {
      const jwtPayload = {
        id: 'user-id',
        email: 'test@test.com',
        iat: 123,
        exp: 456,
      };
      const mockProjects = [{ _id: 'project-id', name: 'Project 1' }];

      mockProjectService.findAll.mockResolvedValue(mockProjects);

      const result = await controller.findAll(jwtPayload as any);

      expect(result).toEqual(mockProjects);
      expect(mockProjectService.findAll).toHaveBeenCalledWith('user-id');
    });
  });

  describe('findOne', () => {
    it('should return a single project', async () => {
      const jwtPayload = {
        id: 'user-id',
        email: 'test@test.com',
        iat: 123,
        exp: 456,
      };
      const mockProject = { _id: 'project-id', name: 'Project 1' };

      mockProjectService.findOne.mockResolvedValue(mockProject);

      const result = await controller.findOne('proj1', jwtPayload as any);

      expect(result).toEqual(mockProject);
      expect(mockProjectService.findOne).toHaveBeenCalledWith(
        'proj1',
        'user-id',
      );
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const jwtPayload = {
        id: 'user-id',
        email: 'test@test.com',
        iat: 123,
        exp: 456,
      };
      const updateProjectDto = { name: 'Updated Project' };

      mockProjectService.update.mockResolvedValue({ message: 'Success' });

      const result = await controller.update(
        jwtPayload as any,
        'proj1',
        updateProjectDto,
      );

      expect(result).toEqual({ message: 'Success' });
      expect(mockProjectService.update).toHaveBeenCalledWith(
        'user-id',
        'proj1',
        updateProjectDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a project', async () => {
      mockProjectService.remove.mockResolvedValue({ message: 'Success' });

      const result = await controller.remove('proj1');

      expect(result).toEqual({ message: 'Success' });
      expect(mockProjectService.remove).toHaveBeenCalledWith('proj1');
    });
  });
});
