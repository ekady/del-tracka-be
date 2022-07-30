import { AsyncModelFactory } from '@nestjs/mongoose';
import { softDeletePlugin } from 'src/database/plugins';
import { Role, RoleSchema } from './role.schema';

export const RoleSchemaProvider: AsyncModelFactory = {
  name: Role.name,
  useFactory: () => {
    const schema = RoleSchema;
    schema.plugin(softDeletePlugin);

    return schema;
  },
};
