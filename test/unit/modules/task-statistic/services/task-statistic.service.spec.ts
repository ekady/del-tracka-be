import { Test, TestingModule } from '@nestjs/testing';

import { ProjectHelperService } from 'src/modules/project/services/project-helper.service';
import { TaskStatisticService } from 'src/modules/task-statistic/services/task-statistic.service';
import { UserProjectRepository } from 'src/modules/user-project/repositories/user-project.repository';
import { UserProjectService } from 'src/modules/user-project/services/user-project.service';
import { ETaskStatus } from 'src/shared/enums';

describe('TaskStatisticService', () => {
  let service: TaskStatisticService;
  let userProjectRepository: UserProjectRepository;
  let projectHelperService: ProjectHelperService;
  let userProjectService: UserProjectService;

  const mockUserProjectRepository = {
    aggregate: jest.fn(),
  };

  const mockProjectHelperService = {
    findProjectByShortId: jest.fn(),
  };

  const mockUserProjectService = {
    findUserProject: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskStatisticService,
        { provide: UserProjectRepository, useValue: mockUserProjectRepository },
        { provide: ProjectHelperService, useValue: mockProjectHelperService },
        { provide: UserProjectService, useValue: mockUserProjectService },
      ],
    }).compile();

    service = module.get<TaskStatisticService>(TaskStatisticService);
    userProjectRepository = module.get<UserProjectRepository>(
      UserProjectRepository,
    );
    projectHelperService =
      module.get<ProjectHelperService>(ProjectHelperService);
    userProjectService = module.get<UserProjectService>(UserProjectService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTasksStatisticByStatus', () => {
    it('should return task statistics by status', async () => {
      const mockStats = [
        { _id: ETaskStatus.Open, name: ETaskStatus.Open, count: 5 },
        { _id: ETaskStatus.InProgress, name: ETaskStatus.InProgress, count: 3 },
      ];

      mockUserProjectRepository.aggregate.mockResolvedValue(mockStats);

      const result = await service.getTasksStatisticByStatus({
        $match: { user: 'user-id' },
      });

      expect(result).toEqual(mockStats);
    });
  });

  describe('getTasksStatisticAll', () => {
    it('should return all task statistics', async () => {
      const mockStats = [
        { _id: ETaskStatus.Open, name: ETaskStatus.Open, count: 5 },
        { _id: ETaskStatus.Closed, name: ETaskStatus.Closed, count: 10 },
      ];

      mockUserProjectRepository.aggregate.mockResolvedValue(mockStats);

      const result = await service.getTasksStatisticAll('user-id');

      expect(result[ETaskStatus.Open]).toBe(5);
      expect(result[ETaskStatus.Closed]).toBe(10);
    });
  });

  describe('getTasksStatisticByUser', () => {
    it('should return task statistics for a user', async () => {
      const mockStats = [
        { _id: ETaskStatus.Open, name: ETaskStatus.Open, count: 2 },
      ];

      mockUserProjectRepository.aggregate.mockResolvedValue(mockStats);

      const result = await service.getTasksStatisticByUser('user-id');

      expect(result[ETaskStatus.Open]).toBe(2);
    });
  });

  describe('getTotalProjectAndTask', () => {
    it('should return total project and task count', async () => {
      const mockStats = [
        { _id: ETaskStatus.Open, name: ETaskStatus.Open, count: 5 },
        { _id: ETaskStatus.Closed, name: ETaskStatus.Closed, count: 10 },
      ];
      const mockProjects = [{ _id: 'proj1' }, { _id: 'proj2' }];

      mockUserProjectRepository.aggregate.mockResolvedValue(mockStats);
      mockUserProjectService.findUserProject.mockResolvedValue(mockProjects);

      const result = await service.getTotalProjectAndTask('user-id');

      expect(result.totalProject).toBe(2);
      expect(result.totalTask).toBe(15);
    });
  });

  describe('getTasksStatisticByProjectShortId', () => {
    it('should return task statistics for a project', async () => {
      const mockProject = { _id: 'project-id', shortId: 'proj1' };
      const mockStats = [
        { _id: ETaskStatus.Open, name: ETaskStatus.Open, count: 3 },
      ];

      mockProjectHelperService.findProjectByShortId.mockResolvedValue(
        mockProject,
      );
      mockUserProjectRepository.aggregate.mockResolvedValue(mockStats);

      const result = await service.getTasksStatisticByProjectShortId(
        'user-id',
        'proj1',
      );

      expect(result).toEqual(mockStats);
    });
  });
});
