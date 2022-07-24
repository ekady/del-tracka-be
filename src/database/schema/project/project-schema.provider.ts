import { AsyncModelFactory } from '@nestjs/mongoose';
import { softDeletePlugin } from 'src/database/plugins';
import { Project, ProjectSchema } from './project.schema';

export const ProjectSchemaProvider: AsyncModelFactory = {
  name: Project.name,
  useFactory: async () => {
    const schema = ProjectSchema;
    schema.plugin(softDeletePlugin);

    return schema;
  },
};
