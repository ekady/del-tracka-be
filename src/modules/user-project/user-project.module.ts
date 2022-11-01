import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserProjectRepository } from './repositories/user-project.repository';
import { UserProjectFeature } from './schema/user-project.schema';
import { UserProjectService } from './services/user-project.service';

@Module({
  providers: [UserProjectRepository, UserProjectService],
  exports: [UserProjectRepository, UserProjectService],
  imports: [MongooseModule.forFeature([UserProjectFeature])],
})
export class UserProjectModule {}
