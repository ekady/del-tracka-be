import { AsyncModelFactory } from '@nestjs/mongoose';
import { softDeletePlugin } from 'src/database/plugins';
import { Task, TaskSchema } from './task.schema';

export const TaskSchemaProvider: AsyncModelFactory = {
  name: Task.name,
  useFactory: () => {
    const schema = TaskSchema;
    schema.plugin(softDeletePlugin);
    schema.index({ status: 1 });

    return schema;
  },
};
