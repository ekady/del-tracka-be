import { Test, TestingModule } from '@nestjs/testing';

import { FileStreamController } from 'src/modules/file-stream/controllers/file-stream.controller';
import { FileStreamService } from 'src/modules/file-stream/services/file-stream.service';

describe('FileStreamController', () => {
  let controller: FileStreamController;
  let fileStreamService: FileStreamService;

  const mockFileStreamService = {
    getFileStream: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileStreamController],
      providers: [
        { provide: FileStreamService, useValue: mockFileStreamService },
      ],
    }).compile();

    controller = module.get<FileStreamController>(FileStreamController);
    fileStreamService = module.get<FileStreamService>(FileStreamService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFileStream', () => {
    it('should return a file stream', async () => {
      const mockStream = { getStream: jest.fn() };

      mockFileStreamService.getFileStream.mockResolvedValue(mockStream);

      const result = await controller.getFileStream('test-file.pdf');

      expect(result).toEqual(mockStream);
      expect(mockFileStreamService.getFileStream).toHaveBeenCalledWith(
        'test-file.pdf',
      );
    });
  });
});
