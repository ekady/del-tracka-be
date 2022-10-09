import { AsyncModelFactory } from '@nestjs/mongoose';
import { generateShortId } from 'src/helpers';
import { Task, TaskSchema } from './task.schema';

export const TaskSchemaProvider: AsyncModelFactory = {
  name: Task.name,
  useFactory: () => {
    const schema = TaskSchema;
    schema.index({ status: 1 });

    schema.pre('save', async function () {
      if (this.isNew) {
        this.shortId = generateShortId();
      }
    });

    return schema;
  },
};
