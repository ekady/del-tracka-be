import { AsyncModelFactory } from '@nestjs/mongoose';
import { Project, ProjectDocument, ProjectSchema } from './project.schema';
import { slugUrl } from 'src/helpers';

export const ProjectSchemaProvider: AsyncModelFactory = {
  name: Project.name,
  useFactory: () => {
    const schema = ProjectSchema;

    schema.pre<ProjectDocument>('save', async function () {
      if (this.isModified(this.name) || this.isNew) {
        this.slug = slugUrl(this.name);
      }
    });

    return schema;
  },
};
