import { Module } from '@nestjs/common';
import { ProfileService } from './services/profile.service';
import { ProfileController } from './controllers/profile.controller';
import { UserModule } from '../user/user.module';
import { AwsModule } from 'src/common/aws/aws.module';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [UserModule, AwsModule],
})
export class ProfileModule {}
