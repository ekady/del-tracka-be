import { Test, TestingModule } from '@nestjs/testing';
import { ProjectSectionsController } from './project-sections.controller';
import { ProjectSectionsService } from './project-sections.service';

describe('ProjectSectionsController', () => {
  let controller: ProjectSectionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectSectionsController],
      providers: [ProjectSectionsService],
    }).compile();

    controller = module.get<ProjectSectionsController>(ProjectSectionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
