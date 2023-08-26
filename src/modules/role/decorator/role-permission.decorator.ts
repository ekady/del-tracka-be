import { SetMetadata } from '@nestjs/common';
import { PermissionMenu, ProjectMenu } from 'src/shared/enums';

export const RolePermission = (menu: ProjectMenu, permission: PermissionMenu) =>
  SetMetadata('permission', [menu, permission]);
