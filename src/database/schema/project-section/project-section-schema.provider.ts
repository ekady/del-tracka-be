import { AsyncModelFactory } from '@nestjs/mongoose';
import { softDeletePlugin } from 'src/database/plugins';
import { ProjectSection, ProjectSectionSchema } from './project-section.schema';

export const ProjectSectionSchemaProvider: AsyncModelFactory = {
  name: ProjectSection.name,
  useFactory: () => {
    const schema = ProjectSectionSchema;
    schema.plugin(softDeletePlugin);

    return schema;
  },
};
