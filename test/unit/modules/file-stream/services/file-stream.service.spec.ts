import { Readable } from 'stream';

import { Test, TestingModule } from '@nestjs/testing';

import { AwsS3Service } from 'src/common/aws/services/aws.s3.service';
import { FileStreamService } from 'src/modules/file-stream/services/file-stream.service';

describe('FileStreamService', () => {
  let service: FileStreamService;
  let awsS3Service: AwsS3Service;

  const mockAwsS3Service = {
    getItemInBucket: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileStreamService,
        { provide: AwsS3Service, useValue: mockAwsS3Service },
      ],
    }).compile();

    service = module.get<FileStreamService>(FileStreamService);
    awsS3Service = module.get<AwsS3Service>(AwsS3Service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFileStream', () => {
    it('should return a streamable file', async () => {
      const mockFile = {
        Body: Buffer.from('test content'),
        ContentType: 'application/pdf',
      };

      mockAwsS3Service.getItemInBucket.mockResolvedValue(mockFile);

      const result = await service.getFileStream('test-file.pdf');

      expect(result).toBeDefined();
      expect(mockAwsS3Service.getItemInBucket).toHaveBeenCalledWith(
        'test-file.pdf',
      );
    });
  });
});
