import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Types } from 'mongoose';
import { DocumentNotFoundException } from 'src/common/http-exceptions/exceptions';
import { UserProjectService } from 'src/modules/user-project/user-project.service';
import { ProjectRolesService } from '../project-roles.service';

@Injectable()
export class RolePermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userProjectService: UserProjectService,
    private projectRolesService: ProjectRolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const menuPermission = this.reflector.get(
      'permission',
      context.getHandler(),
    );
    if (!menuPermission) return true;

    const [menu, permission] = menuPermission;
    const { id: userId } = request.user;
    const projectId = new Types.ObjectId(request.params.projectId);

    return this.matchingPermission(userId, projectId, menu, permission);
  }

  async matchingPermission(
    userId: Types.ObjectId,
    projectId: Types.ObjectId,
    menu: string,
    permission: string,
  ): Promise<boolean> {
    const userProject = await this.userProjectService.findUserProject(
      { user: userId, project: projectId },
      [{ path: 'role', select: '_id' }],
    );
    if (!userProject) throw new DocumentNotFoundException('Project Not Found');

    const rolePermission = await this.projectRolesService.findOnePermission({
      menu,
      projectRole: userProject.role._id,
    });

    return !!rolePermission[permission];
  }
}
