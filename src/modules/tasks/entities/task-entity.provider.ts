import { AsyncModelFactory } from '@nestjs/mongoose';
import { generateShortId } from 'src/helpers';
import { TaskEntity, TaskSchema } from './task.entity';

export const TaskSchemaProvider: AsyncModelFactory = {
  name: TaskEntity.name,
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
