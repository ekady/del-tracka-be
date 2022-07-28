import { AsyncModelFactory } from '@nestjs/mongoose';
import { softDeletePlugin } from 'src/database/plugins';
import { ProjectRole, ProjectRoleSchema } from './project-role.schema';

export const ProjectRoleSchemaProvider: AsyncModelFactory = {
  name: ProjectRole.name,
  useFactory: () => {
    const schema = ProjectRoleSchema;
    schema.plugin(softDeletePlugin);

    return schema;
  },
};
