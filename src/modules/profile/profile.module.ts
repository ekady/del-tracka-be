import { Module } from '@nestjs/common';
import { ProfileService } from './services/profile.service';
import { ProfileController } from './controllers/profile.controller';
import { UsersModule } from '../users/users.module';
import { AwsModule } from 'src/common/aws/aws.module';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [UsersModule, AwsModule],
})
export class ProfileModule {}
