import { Module } from '@nestjs/common';

import { AwsModule } from 'src/common/aws/aws.module';

import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [UserModule, AwsModule],
})
export class ProfileModule {}
