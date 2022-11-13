import {
  DatabaseCreateManyOptions,
  DatabaseManyOptions,
  DatabaseSoftDeleteManyOptions,
  DatabaseRestoreManyOptions,
} from './database.interface';

export interface DatabaseBulkRepositoryAbstract {
  createMany<N>(
    data: N[],
    options?: DatabaseCreateManyOptions,
  ): Promise<boolean>;

  deleteManyById(
    _id: string[],
    options?: DatabaseManyOptions,
  ): Promise<boolean>;

  deleteMany(
    find: Record<string, any>,
    options?: DatabaseManyOptions,
  ): Promise<boolean>;

  softDeleteManyById(
    _id: string[],
    options?: DatabaseSoftDeleteManyOptions,
  ): Promise<boolean>;

  softDeleteMany(
    find: Record<string, any>,
    options?: DatabaseSoftDeleteManyOptions,
  ): Promise<boolean>;

  restore(
    _id: string[],
    options?: DatabaseRestoreManyOptions,
  ): Promise<boolean>;

  updateMany<N>(
    find: Record<string, any>,
    data: N,
    options?: DatabaseManyOptions,
  ): Promise<boolean>;
}
