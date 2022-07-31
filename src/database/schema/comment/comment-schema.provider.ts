import { AsyncModelFactory } from '@nestjs/mongoose';
import { softDeletePlugin } from 'src/database/plugins';
import { Comment, CommentSchema } from './comment.schema';

export const CommentSchemaProvider: AsyncModelFactory = {
  name: Comment.name,
  useFactory: async () => {
    const schema = CommentSchema;
    schema.plugin(softDeletePlugin);

    return schema;
  },
};
