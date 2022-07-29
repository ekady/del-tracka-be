import { Test, TestingModule } from '@nestjs/testing';
import { ProjectSectionsService } from './project-sections.service';

describe('ProjectSectionsService', () => {
  let service: ProjectSectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectSectionsService],
    }).compile();

    service = module.get<ProjectSectionsService>(ProjectSectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
