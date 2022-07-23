import { Module } from '@nestjs/common';
import { GroupProjectService } from './group-project.service';
import { GroupProjectController } from './group-project.controller';
import { UserProjectModule } from '../user-project/user-project.module';

@Module({
  controllers: [GroupProjectController],
  providers: [GroupProjectService],
  imports: [UserProjectModule],
})
export class GroupProjectModule {}
