import { Test, TestingModule } from '@nestjs/testing';

import { ProjectHelperService } from 'src/modules/project/services/project-helper.service';
import { StageRepository } from 'src/modules/stage/repositories/stage.repository';
import { StageHelperService } from 'src/modules/stage/services/stage-helper.service';
import { DocumentNotFoundException } from 'src/shared/http-exceptions/exceptions';

describe('StageHelperService', () => {
  let service: StageHelperService;
  let stageRepository: StageRepository;
  let projectHelperService: ProjectHelperService;

  const mockStageRepository = {
    findOne: jest.fn(),
  };

  const mockProjectHelperService = {
    findProjectById: jest.fn(),
    findProjectByShortId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StageHelperService,
        { provide: StageRepository, useValue: mockStageRepository },
        { provide: ProjectHelperService, useValue: mockProjectHelperService },
      ],
    }).compile();

    service = module.get<StageHelperService>(StageHelperService);
    stageRepository = module.get<StageRepository>(StageRepository);
    projectHelperService =
      module.get<ProjectHelperService>(ProjectHelperService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findStageById', () => {
    it('should return stage when found', async () => {
      const mockProject = { _id: '665000000000000000000002' };
      const mockStage = { _id: '665000000000000000000001', name: 'Stage 1' };

      mockProjectHelperService.findProjectById.mockResolvedValue(mockProject);
      mockStageRepository.findOne.mockResolvedValue(mockStage);

      const result = await service.findStageById(
        '665000000000000000000001',
        '665000000000000000000002',
      );

      expect(result).toEqual(mockStage);
    });

    it('should throw DocumentNotFoundException when stage not found', async () => {
      const mockProject = { _id: '665000000000000000000002' };

      mockProjectHelperService.findProjectById.mockResolvedValue(mockProject);
      mockStageRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findStageById(
          '665000000000000000000001',
          '665000000000000000000002',
        ),
      ).rejects.toThrow(DocumentNotFoundException);
    });
  });

  describe('findStageByShortId', () => {
    it('should return stage when found', async () => {
      const mockProject = { _id: 'project-id' };
      const mockStage = { _id: 'stage-id', shortId: 's1', name: 'Stage 1' };

      mockProjectHelperService.findProjectByShortId.mockResolvedValue(
        mockProject,
      );
      mockStageRepository.findOne.mockResolvedValue(mockStage);

      const result = await service.findStageByShortId('s1', 'proj1');

      expect(result).toEqual(mockStage);
    });

    it('should throw DocumentNotFoundException when stage not found', async () => {
      const mockProject = { _id: 'project-id' };

      mockProjectHelperService.findProjectByShortId.mockResolvedValue(
        mockProject,
      );
      mockStageRepository.findOne.mockResolvedValue(null);

      await expect(service.findStageByShortId('s1', 'proj1')).rejects.toThrow(
        DocumentNotFoundException,
      );
    });
  });
});
