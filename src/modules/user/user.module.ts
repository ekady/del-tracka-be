import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './repositories/user.repository';
import { UserSchemaProvider } from './entities/user-entity.provider';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { AwsModule } from 'src/common/aws/aws.module';

@Module({
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserRepository, UserService],
  imports: [MongooseModule.forFeatureAsync([UserSchemaProvider]), AwsModule],
})
export class UserModule {}
