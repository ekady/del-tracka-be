import { Test, TestingModule } from '@nestjs/testing';

import { ProjectRepository } from 'src/modules/project/repositories/project.repository';
import { ProjectHelperService } from 'src/modules/project/services/project-helper.service';
import { DocumentNotFoundException } from 'src/shared/http-exceptions/exceptions';

describe('ProjectHelperService', () => {
  let service: ProjectHelperService;
  let projectRepository: ProjectRepository;

  const mockProjectRepository = {
    findOneById: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectHelperService,
        { provide: ProjectRepository, useValue: mockProjectRepository },
      ],
    }).compile();

    service = module.get<ProjectHelperService>(ProjectHelperService);
    projectRepository = module.get<ProjectRepository>(ProjectRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findProjectById', () => {
    it('should return project when found', async () => {
      const mockProject = { _id: 'project-id', name: 'Test Project' };
      mockProjectRepository.findOneById.mockResolvedValue(mockProject);

      const result = await service.findProjectById('project-id');

      expect(result).toEqual(mockProject);
    });

    it('should throw DocumentNotFoundException when not found', async () => {
      mockProjectRepository.findOneById.mockResolvedValue(null);

      await expect(service.findProjectById('non-existent')).rejects.toThrow(
        DocumentNotFoundException,
      );
    });
  });

  describe('findProjectByShortId', () => {
    it('should return project when found', async () => {
      const mockProject = {
        _id: 'project-id',
        shortId: 'proj1',
        name: 'Test Project',
      };
      mockProjectRepository.findOne.mockResolvedValue(mockProject);

      const result = await service.findProjectByShortId('proj1');

      expect(result).toEqual(mockProject);
      expect(mockProjectRepository.findOne).toHaveBeenCalledWith({
        shortId: 'proj1',
      });
    });

    it('should throw DocumentNotFoundException when not found', async () => {
      mockProjectRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findProjectByShortId('non-existent'),
      ).rejects.toThrow(DocumentNotFoundException);
    });
  });
});
