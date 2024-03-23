import {
  TDatabaseCreateManyOptions,
  TDatabaseManyOptions,
  TDatabaseSoftDeleteManyOptions,
  TDatabaseRestoreManyOptions,
} from './database.interface';

export interface IDatabaseBulkRepositoryAbstract {
  createMany<N>(
    data: N[],
    options?: TDatabaseCreateManyOptions,
  ): Promise<boolean>;

  deleteManyById(
    _id: string[],
    options?: TDatabaseManyOptions,
  ): Promise<boolean>;

  deleteMany(
    find: Record<string, any>,
    options?: TDatabaseManyOptions,
  ): Promise<boolean>;

  softDeleteManyById(
    _id: string[],
    options?: TDatabaseSoftDeleteManyOptions,
  ): Promise<boolean>;

  softDeleteMany(
    find: Record<string, any>,
    options?: TDatabaseSoftDeleteManyOptions,
  ): Promise<boolean>;

  restore(
    _id: string[],
    options?: TDatabaseRestoreManyOptions,
  ): Promise<boolean>;

  updateMany<N>(
    find: Record<string, any>,
    data: N,
    options?: TDatabaseManyOptions,
  ): Promise<boolean>;
}
