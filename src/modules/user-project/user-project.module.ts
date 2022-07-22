import { Module } from '@nestjs/common';
import { UserProjectService } from './user-project.service';

@Module({
  providers: [UserProjectService],
  exports: [UserProjectService],
})
export class UserProjectModule {}
