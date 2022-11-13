import { AsyncModelFactory } from '@nestjs/mongoose';
import { generateShortId } from 'src/helpers';
import { StageEntity, StageDocument, StageSchema } from './stage.schema';

export const StageSchemaProvider: AsyncModelFactory = {
  name: StageEntity.name,
  useFactory: () => {
    const schema = StageSchema;

    schema.pre<StageDocument>('save', async function () {
      if (this.isNew) {
        this.shortId = generateShortId();
      }
    });

    return schema;
  },
};
