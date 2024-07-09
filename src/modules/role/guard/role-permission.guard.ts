import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PermissionService } from 'src/modules/permission/services/permission.service';
import { UserProjectService } from 'src/modules/user-project/services/user-project.service';

@Injectable()
export class RolePermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userProjectService: UserProjectService,
    private permissionService: PermissionService,
  ) {}

  async matchingPermission(
    userId: string,
    shortId: string,
    menu: string,
    permission: string,
  ): Promise<boolean> {
    const userProject = await this.userProjectService.findUserProjects(
      userId,
      shortId,
    );
    const rolePermission = await this.permissionService.findOne({
      menu,
      role: userProject.role._id,
    });

    return !!rolePermission[permission];
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const menuPermission = this.reflector.get(
      'permission',
      context.getHandler(),
    );
    if (!menuPermission) return true;

    const [menu, permission] = menuPermission;
    const { id: userId } = request.user;
    const shortId = request.params.projectShortId ?? request.params.shortId;

    return this.matchingPermission(userId, shortId, menu, permission);
  }
}
