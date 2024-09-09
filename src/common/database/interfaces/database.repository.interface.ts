import { Document, PipelineStage } from 'mongoose';

import { IPaginationResponse } from 'src/shared/interfaces/pagination.interface';

import {
  IDatabaseCreateOptions,
  TDatabaseSoftDeleteOptions,
  IDatabaseExistOptions,
  IDatabaseFindAllAggregateOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalAggregateOptions,
  TDatabaseOptions,
  TDatabaseRestoreOptions,
  TDatabaseAggregateOptions,
} from './database.interface';

export interface IDatabaseRepositoryAbstract<T extends Document> {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<IPaginationResponse<T[]>>;

  findAllAggregate<N>(
    pipeline: PipelineStage[],
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<IPaginationResponse<N[]>>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<T>;

  findOneById(_id: string, options?: IDatabaseFindOneOptions): Promise<T>;

  findOneAggregate<N>(
    pipeline: PipelineStage[],
    options?: TDatabaseAggregateOptions,
  ): Promise<N[]>;

  getTotal(
    find?: Record<string, any>,
    options?: TDatabaseOptions,
  ): Promise<number>;

  getTotalAggregate(
    pipeline: PipelineStage[],
    options?: IDatabaseGetTotalAggregateOptions,
  ): Promise<number>;

  exists(
    find: Record<string, any>,
    options?: IDatabaseExistOptions,
  ): Promise<boolean>;

  aggregate<N>(
    pipeline: Record<string, any>[],
    options?: TDatabaseAggregateOptions,
  ): Promise<N[]>;

  create<N>(data: N, options?: IDatabaseCreateOptions): Promise<T>;

  updateOneById<N>(
    _id: string,
    data: N,
    options?: TDatabaseOptions,
  ): Promise<T>;

  updateOne<N>(
    find: Record<string, any>,
    data: N,
    options?: TDatabaseOptions,
  ): Promise<T>;

  deleteOne(find: Record<string, any>, options?: TDatabaseOptions): Promise<T>;

  deleteOneById(_id: string, options?: TDatabaseOptions): Promise<T>;

  softDeleteOneById(
    _id: string,
    options?: TDatabaseSoftDeleteOptions,
  ): Promise<T>;

  softDeleteOne(
    find: Record<string, any>,
    options?: TDatabaseSoftDeleteOptions,
  ): Promise<T>;

  restore(_id: string, options?: TDatabaseRestoreOptions): Promise<T>;
}
