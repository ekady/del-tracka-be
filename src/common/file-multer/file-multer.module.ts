import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

@Global()
@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        limits: {
          fileSize:
            parseInt(configService.get<string>('MAX_SIZE_PER_FILE_UPLOAD')) *
            1024,
          files: parseInt(configService.get<string>('MAX_NUMBER_FILE_UPLOAD')),
        },
      }),
    }),
  ],
  exports: [MulterModule],
})
export class FileMulterModule {}
