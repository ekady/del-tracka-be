import { AsyncModelFactory } from '@nestjs/mongoose';
import { softDeletePlugin } from 'src/database/plugins';
import { Stage, StageSchema } from './stage.schema';

export const StageSchemaProvider: AsyncModelFactory = {
  name: Stage.name,
  useFactory: () => {
    const schema = StageSchema;
    schema.plugin(softDeletePlugin);

    return schema;
  },
};
