import { AsyncModelFactory } from '@nestjs/mongoose';
import { softDeletePlugin } from 'src/database/plugins';
import { GroupProject, GroupProjectSchema } from './group-project.schema';

export const GroupProjectSchemaProvider: AsyncModelFactory = {
  name: GroupProject.name,
  useFactory: () => {
    const schema = GroupProjectSchema;
    schema.plugin(softDeletePlugin);

    return schema;
  },
};
