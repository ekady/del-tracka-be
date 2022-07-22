import { AsyncModelFactory } from '@nestjs/mongoose';
import { softDeletePlugin } from 'src/database/plugins';
import { UserProject, UserProjectSchema } from './user-project.schema';

export const UserProjectSchemaProvider: AsyncModelFactory = {
  name: UserProject.name,
  useFactory: () => {
    const schema = UserProjectSchema;
    schema.plugin(softDeletePlugin);

    return schema;
  },
};
