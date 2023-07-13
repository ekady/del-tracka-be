import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from './repositories/users.repository';
import { UserSchemaProvider } from './entities/user-entity.provider';
import { UsersService } from './services/users.service';
import { UserController } from './controllers/users.controller';
import { AwsModule } from 'src/common/aws/aws.module';

@Module({
  controllers: [UserController],
  providers: [UsersRepository, UsersService],
  exports: [UsersRepository, UsersService],
  imports: [MongooseModule.forFeatureAsync([UserSchemaProvider]), AwsModule],
})
export class UsersModule {}
