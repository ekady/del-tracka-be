import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserProjectService } from 'src/modules/user-project/user-project.service';
import { RolesService } from '../roles.service';

@Injectable()
export class RolePermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userProjectService: UserProjectService,
    private rolesService: RolesService,
  ) {}

  async matchingPermission(
    userId: string,
    shortId: string,
    menu: string,
    permission: string,
  ): Promise<boolean> {
    const userProject = await this.userProjectService.findUserProject(
      userId,
      shortId,
    );
    const rolePermission = await this.rolesService.findOnePermission({
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
    const shortId = request.params.projectId;

    return this.matchingPermission(userId, shortId, menu, permission);
  }
}
