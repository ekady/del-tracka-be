import { Module } from '@nestjs/common';
import { LoggerOptionService } from 'src/logger/services/logger-options.service';

@Module({
  providers: [LoggerOptionService],
  exports: [LoggerOptionService],
  imports: [],
})
export class LoggerOptionsModule {}
