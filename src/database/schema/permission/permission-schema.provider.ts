import { AsyncModelFactory } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from './permission.schema';

export const PermissionSchemaProvider: AsyncModelFactory = {
  name: Permission.name,
  useFactory: () => {
    return PermissionSchema;
  },
};
