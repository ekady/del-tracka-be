import { AsyncModelFactory } from '@nestjs/mongoose';
import { Task, TaskSchema } from './task.schema';

export const TaskSchemaProvider: AsyncModelFactory = {
  name: Task.name,
  useFactory: () => {
    const schema = TaskSchema;
    schema.index({ status: 1 });

    return schema;
  },
};
