import { SetMetadata } from '@nestjs/common';

import { EPermissionMenu, EProjectMenu } from 'src/shared/enums';

export const RolePermission = (
  menu: EProjectMenu,
  permission: EPermissionMenu,
) => SetMetadata('permission', [menu, permission]);
