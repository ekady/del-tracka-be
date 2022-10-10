import { AsyncModelFactory } from '@nestjs/mongoose';
import { generateShortId } from 'src/helpers';
import { Stage, StageSchema } from './stage.schema';

export const StageSchemaProvider: AsyncModelFactory = {
  name: Stage.name,
  useFactory: () => {
    const schema = StageSchema;

    schema.pre('save', async function () {
      if (this.isNew) {
        this.shortId = generateShortId();
      }
    });

    return schema;
  },
};