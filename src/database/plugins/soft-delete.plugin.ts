import { Document, Query, Schema, Aggregate } from 'mongoose';

export type DataWithSoftDelete = {
  isDeleted: boolean;
  deletedAt: Date | null;
};

type DataDocument = DataWithSoftDelete & Document;

const setDocumentIsDeleted = async (doc: DataDocument) => {
  doc.isDeleted = true;
  doc.deletedAt = new Date();
  doc.$isDeleted(true);
  await doc.save();
};

const excludeInFindQueriesIsDeleted = async function (
  this: Query<DataDocument, DataDocument>,
) {
  this.where({ isDeleted: false });
};

const excludeInDeletedInAggregateMiddleware = async function (
  this: Aggregate<any>,
) {
  this.pipeline().unshift({ $match: { isDeleted: false } });
};

export const softDeletePlugin = (schema: Schema) => {
  schema.add({
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
      select: false,
    },
    deletedAt: {
      type: Date,
      default: null,
      select: false,
    },
  });

  schema.index({ isDeleted: -1 });

  const typesQueryFind = [
    'count',
    'find',
    'findOne',
    'findOneAndDelete',
    'findOneAndRemove',
    'findOneAndUpdate',
    'update',
    'updateOne',
    'updateMany',
  ];

  schema.pre('remove', async function (this: DataDocument) {
    await setDocumentIsDeleted(this);
  });

  typesQueryFind.forEach((type) => {
    schema.pre(type as unknown as RegExp, excludeInFindQueriesIsDeleted);
  });

  schema.pre('aggregate', excludeInDeletedInAggregateMiddleware);

  schema.post('save', async function (this: DataDocument) {
    this.isDeleted = undefined;
    this.deletedAt = undefined;
  });
};
