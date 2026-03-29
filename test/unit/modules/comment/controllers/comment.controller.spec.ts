import { Test, TestingModule } from '@nestjs/testing';

import { CommentController } from 'src/modules/comment/controllers/comment.controller';
import { CommentService } from 'src/modules/comment/services/comment.service';

describe('CommentController', () => {
  let controller: CommentController;
  let commentService: CommentService;

  const mockCommentService = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [{ provide: CommentService, useValue: mockCommentService }],
    }).compile();

    controller = module.get<CommentController>(CommentController);
    commentService = module.get<CommentService>(CommentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a comment', async () => {
      const jwtPayload = {
        id: 'user-id',
        email: 'test@test.com',
        iat: 123,
        exp: 456,
      };
      const createDto = { comment: 'Test comment' };

      mockCommentService.create.mockResolvedValue({ message: 'Success' });

      const result = await controller.create(
        jwtPayload,
        'proj1',
        's1',
        't1',
        createDto,
      );

      expect(result).toEqual({ message: 'Success' });
      expect(mockCommentService.create).toHaveBeenCalledWith(
        { projectShortId: 'proj1', stageShortId: 's1', taskShortId: 't1' },
        'user-id',
        createDto,
      );
    });
  });

  describe('findAll', () => {
    it('should return all comments', async () => {
      const mockComments = {
        data: [],
        pagination: { limit: 10, page: 1, total: 0, totalPages: 0 },
      };

      mockCommentService.findAll.mockResolvedValue(mockComments);

      const result = await controller.findAll('proj1', 's1', 't1', {
        limit: 10,
        page: 1,
      } as any);

      expect(result).toEqual(mockComments);
    });
  });
});
