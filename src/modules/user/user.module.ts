import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AwsModule } from 'src/common/aws/aws.module';

import { UserController } from './controllers/user.controller';
import { UserSchemaProvider } from './entities/user-entity.provider';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';

@Module({
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserRepository, UserService],
  imports: [MongooseModule.forFeatureAsync([UserSchemaProvider]), AwsModule],
})
export class UserModule {}
