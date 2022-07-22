import { Module } from '@nestjs/common';
import { GroupProjectService } from './group-project.service';
import { GroupProjectController } from './group-project.controller';
import { UserProjectService } from '../user-project/user-project.service';

@Module({
  controllers: [GroupProjectController],
  providers: [GroupProjectService],
  imports: [UserProjectService],
})
export class GroupProjectModule {}
