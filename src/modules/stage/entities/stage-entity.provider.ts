import { AsyncModelFactory } from '@nestjs/mongoose';
import { generateShortId } from 'src/shared/helpers';
import { StageEntity, TStageDocument, StageSchema } from './stage.entity';

export const StageSchemaProvider: AsyncModelFactory = {
  name: StageEntity.name,
  useFactory: () => {
    const schema = StageSchema;

    schema.pre<TStageDocument>('save', async function () {
      if (this.isNew) {
        this.shortId = generateShortId();
      }
    });

    return schema;
  },
};
