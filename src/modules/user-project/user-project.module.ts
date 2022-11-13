import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserProjectBulkRepository } from './repositories/user-project.bulk.repository';
import { UserProjectRepository } from './repositories/user-project.repository';
import { UserProjectFeature } from './entities/user-project.entity';
import { UserProjectService } from './services/user-project.service';

@Module({
  providers: [
    UserProjectRepository,
    UserProjectBulkRepository,
    UserProjectService,
  ],
  exports: [UserProjectRepository, UserProjectService],
  imports: [MongooseModule.forFeature([UserProjectFeature])],
})
export class UserProjectModule {}
