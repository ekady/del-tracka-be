import { AsyncModelFactory } from '@nestjs/mongoose';
import { softDeletePlugin } from 'src/database/plugins';
import { Activity, ActivitySchema } from './activity.schema';

export const ActivitySchemaProvider: AsyncModelFactory = {
  name: Activity.name,
  useFactory: async () => {
    const schema = ActivitySchema;
    schema.plugin(softDeletePlugin);

    return schema;
  },
};
