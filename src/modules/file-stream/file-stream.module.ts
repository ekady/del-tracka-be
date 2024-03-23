import { Module } from '@nestjs/common';

import { FileStreamService } from './services/file-stream.service';
import { FileStreamController } from './controllers/file-stream.controller';
import { AwsModule } from 'src/common/aws/aws.module';

@Module({
  providers: [FileStreamService],
  controllers: [FileStreamController],
  imports: [AwsModule],
})
export class FileStreamModule {}
