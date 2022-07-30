import { SetMetadata } from '@nestjs/common';
import { PermissionMenu, ProjectMenu } from 'src/common/enums';

export const RolePermission = (menu: ProjectMenu, permission: PermissionMenu) =>
  SetMetadata('permission', [menu, permission]);
