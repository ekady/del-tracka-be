import { AsyncModelFactory } from '@nestjs/mongoose';
import {
  ProjectEntity,
  ProjectDocument,
  ProjectSchema,
} from './project.entity';
import { generateShortId } from 'src/shared/helpers';

export const ProjectSchemaProvider: AsyncModelFactory = {
  name: ProjectEntity.name,
  useFactory: () => {
    const schema = ProjectSchema;

    schema.pre<ProjectDocument>('save', async function () {
      if (this.isNew) {
        this.shortId = generateShortId();
      }
    });

    return schema;
  },
};
