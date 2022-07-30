import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { UsersModule } from '../users/users.module';
import { UserProjectModule } from '../user-project/user-project.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [UsersModule, UserProjectModule, RolesModule],
  exports: [ProjectsService],
})
export class ProjectsModule {}
