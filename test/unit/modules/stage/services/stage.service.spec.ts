import { Test, TestingModule } from '@nestjs/testing';

import { ActivityService } from 'src/modules/activity/services/activity.service';
import { ProjectHelperService } from 'src/modules/project/services/project-helper.service';
import { StageRepository } from 'src/modules/stage/repositories/stage.repository';
import { StageHelperService } from 'src/modules/stage/services/stage-helper.service';
import { StageService } from 'src/modules/stage/services/stage.service';
import { EActivityName } from 'src/shared/enums';
import { DocumentExistException } from 'src/shared/http-exceptions/exceptions';

describe('StageService', () => {
  let service: StageService;
  let stageRepository: StageRepository;
  let stageHelperService: StageHelperService;
  let projectHelperService: ProjectHelperService;
  let activityService: ActivityService;

  const mockStageRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    updateOneById: jest.fn(),
    softDeleteOneById: jest.fn(),
  };

  const mockStageHelperService = {
    findStageByShortId: jest.fn(),
    findStageById: jest.fn(),
  };

  const mockProjectHelperService = {
    findProjectByShortId: jest.fn(),
  };

  const mockActivityService = {
    create: jest.fn(),
    findStageActivity: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StageService,
        { provide: StageRepository, useValue: mockStageRepository },
        { provide: StageHelperService, useValue: mockStageHelperService },
        { provide: ProjectHelperService, useValue: mockProjectHelperService },
        { provide: ActivityService, useValue: mockActivityService },
      ],
    }).compile();

    service = module.get<StageService>(StageService);
    stageRepository = module.get<StageRepository>(StageRepository);
    stageHelperService = module.get<StageHelperService>(StageHelperService);
    projectHelperService =
      module.get<ProjectHelperService>(ProjectHelperService);
    activityService = module.get<ActivityService>(ActivityService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a stage successfully', async () => {
      const createStageDto = {
        name: 'New Stage',
        description: 'Test description',
        projectShortId: 'proj1',
      };
      const mockProject = { _id: 'project-id', shortId: 'proj1' };
      const mockStage = { _id: 'stage-id', name: 'New Stage' };

      mockProjectHelperService.findProjectByShortId.mockResolvedValue(
        mockProject,
      );
      mockStageRepository.findOne.mockResolvedValue(null);
      mockStageRepository.create.mockResolvedValue(mockStage);
      mockActivityService.create.mockResolvedValue({ message: 'Success' });

      const result = await service.create('user-id', createStageDto);

      expect(result).toEqual({ message: 'Success' });
      expect(mockStageRepository.create).toHaveBeenCalled();
    });

    it('should throw DocumentExistException when stage name already exists', async () => {
      const createStageDto = {
        name: 'Existing Stage',
        description: 'Test',
        projectShortId: 'proj1',
      };
      const mockProject = { _id: 'project-id' };
      const mockExistingStage = { _id: 'existing-stage-id' };

      mockProjectHelperService.findProjectByShortId.mockResolvedValue(
        mockProject,
      );
      mockStageRepository.findOne.mockResolvedValue(mockExistingStage);

      await expect(service.create('user-id', createStageDto)).rejects.toThrow(
        DocumentExistException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all stages for a project', async () => {
      const mockProject = { _id: 'project-id' };
      const mockStages = {
        data: [
          {
            _id: 'stage1',
            shortId: 's1',
            name: 'Stage 1',
            description: 'Desc',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };

      mockProjectHelperService.findProjectByShortId.mockResolvedValue(
        mockProject,
      );
      mockStageRepository.findAll.mockResolvedValue(mockStages);

      const result = await service.findAll('proj1');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Stage 1');
    });
  });

  describe('findOne', () => {
    it('should return a single stage', async () => {
      const mockStage = {
        _id: 'stage-id',
        shortId: 's1',
        name: 'Stage 1',
        description: 'Desc',
        createdAt: new Date(),
        updatedAt: new Date(),
        project: {
          _id: 'project-id',
          shortId: 'proj1',
          name: 'Project',
          description: 'Desc',
        },
      };

      mockStageHelperService.findStageByShortId.mockResolvedValue(mockStage);

      const result = await service.findOne('s1', 'proj1');

      expect(result.name).toBe('Stage 1');
      expect(result.project.shortId).toBe('proj1');
    });
  });

  describe('update', () => {
    it('should update a stage successfully', async () => {
      const updateStageDto = {
        name: 'Updated Stage',
        description: 'Updated desc',
        userId: 'user-id',
        projectShortId: 'proj1',
      };
      const mockStage = {
        _id: 'stage-id',
        project: { _id: 'project-id' },
        depopulate: jest
          .fn()
          .mockReturnValue({ _id: 'stage-id', name: 'Old Stage' }),
      };
      const mockUpdatedStage = { _id: 'stage-id', name: 'Updated Stage' };

      mockStageHelperService.findStageByShortId.mockResolvedValue(mockStage);
      mockStageRepository.findOne.mockResolvedValue(null);
      mockStageRepository.updateOneById.mockResolvedValue(mockUpdatedStage);
      mockActivityService.create.mockResolvedValue({ message: 'Success' });

      const result = await service.update('s1', updateStageDto);

      expect(result).toEqual({ message: 'Success' });
    });
  });

  describe('remove', () => {
    it('should remove a stage successfully', async () => {
      const mockStage = {
        _id: 'stage-id',
        project: { _id: 'project-id' },
        depopulate: jest.fn().mockReturnValue({ _id: 'stage-id' }),
      };

      mockStageHelperService.findStageByShortId.mockResolvedValue(mockStage);
      mockStageRepository.softDeleteOneById.mockResolvedValue({});
      mockActivityService.create.mockResolvedValue({ message: 'Success' });

      const result = await service.remove(
        { projectShortId: 'proj1', stageShortId: 's1' },
        'user-id',
      );

      expect(result).toEqual({ message: 'Success' });
    });
  });

  describe('findStageActivity', () => {
    it('should return stage activities', async () => {
      const mockStage = { _id: 'stage-id', project: { _id: 'project-id' } };
      const mockActivities = {
        data: [],
        pagination: { limit: 10, page: 1, total: 0, totalPages: 0 },
      };

      mockStageHelperService.findStageByShortId.mockResolvedValue(mockStage);
      mockActivityService.findStageActivity.mockResolvedValue(mockActivities);

      const result = await service.findStageActivity('s1', 'proj1');

      expect(result).toEqual(mockActivities);
    });
  });
});
