import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileController } from './controllers/profile.controller';
import { UsersRepository } from './repositories/users.repository';
import { UserSchemaProvider } from './entities/user-entity.provider';
import { ProfileService } from './services/profile.service';
import { UsersService } from './services/users.service';
import { UserController } from './controllers/users.controller';
import { AwsModule } from 'src/common/aws/aws.module';

@Module({
  controllers: [ProfileController, UserController],
  providers: [UsersRepository, UsersService, ProfileService],
  exports: [UsersRepository, UsersService],
  imports: [MongooseModule.forFeatureAsync([UserSchemaProvider]), AwsModule],
})
export class UsersModule {}
