import { Document, PipelineStage } from 'mongoose';
import { PaginationResponse } from 'src/shared/interfaces/pagination.interface';
import {
  DatabaseCreateOptions,
  DatabaseSoftDeleteOptions,
  DatabaseExistOptions,
  DatabaseFindAllAggregateOptions,
  DatabaseFindAllOptions,
  DatabaseFindOneOptions,
  DatabaseGetTotalAggregateOptions,
  DatabaseOptions,
  DatabaseRestoreOptions,
  DatabaseAggregateOptions,
} from './database.interface';

export interface DatabaseRepositoryAbstract<T extends Document> {
  findAll(
    find?: Record<string, any>,
    options?: DatabaseFindAllOptions,
  ): Promise<PaginationResponse<T[]>>;

  findAllAggregate<N>(
    pipeline: PipelineStage[],
    options?: DatabaseFindAllAggregateOptions,
  ): Promise<PaginationResponse<N[]>>;

  findOne(
    find: Record<string, any>,
    options?: DatabaseFindOneOptions,
  ): Promise<T>;

  findOneById(_id: string, options?: DatabaseFindOneOptions): Promise<T>;

  findOneAggregate<N>(
    pipeline: PipelineStage[],
    options?: DatabaseAggregateOptions,
  ): Promise<N[]>;

  getTotal(
    find?: Record<string, any>,
    options?: DatabaseOptions,
  ): Promise<number>;

  getTotalAggregate(
    pipeline: PipelineStage[],
    options?: DatabaseGetTotalAggregateOptions,
  ): Promise<number>;

  exists(
    find: Record<string, any>,
    options?: DatabaseExistOptions,
  ): Promise<boolean>;

  aggregate<N>(
    pipeline: Record<string, any>[],
    options?: DatabaseAggregateOptions,
  ): Promise<N[]>;

  create<N>(data: N, options?: DatabaseCreateOptions): Promise<T>;

  updateOneById<N>(_id: string, data: N, options?: DatabaseOptions): Promise<T>;

  updateOne<N>(
    find: Record<string, any>,
    data: N,
    options?: DatabaseOptions,
  ): Promise<T>;

  deleteOne(find: Record<string, any>, options?: DatabaseOptions): Promise<T>;

  deleteOneById(_id: string, options?: DatabaseOptions): Promise<T>;

  softDeleteOneById(
    _id: string,
    options?: DatabaseSoftDeleteOptions,
  ): Promise<T>;

  softDeleteOne(
    find: Record<string, any>,
    options?: DatabaseSoftDeleteOptions,
  ): Promise<T>;

  restore(_id: string, options?: DatabaseRestoreOptions): Promise<T>;
}
