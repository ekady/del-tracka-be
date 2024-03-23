import { AsyncModelFactory } from '@nestjs/mongoose';
import { generateShortId } from 'src/shared/helpers';
import {
  ProjectEntity,
  TProjectDocument,
  ProjectSchema,
} from './project.entity';

export const ProjectSchemaProvider: AsyncModelFactory = {
  name: ProjectEntity.name,
  useFactory: () => {
    const schema = ProjectSchema;

    schema.pre<TProjectDocument>('save', async function () {
      if (this.isNew) {
        this.shortId = generateShortId();
      }
    });

    return schema;
  },
};
