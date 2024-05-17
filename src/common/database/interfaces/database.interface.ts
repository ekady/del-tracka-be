import { ClientSession } from 'mongoose';
import { IPaginationOptions } from 'src/shared/interfaces/pagination.interface';

// find one
export interface IDatabaseFindOneOptions
  extends Pick<IPaginationOptions, 'sort'> {
  select?: Record<string, number>;
  populate?: boolean;
  session?: ClientSession;
  withDeleted?: boolean;
  projection?: Record<string, string | number | boolean>;
}

export type TDatabaseOptions = Pick<
  IDatabaseFindOneOptions,
  'session' | 'withDeleted' | 'populate'
>;

// aggregate

export type TDatabaseAggregateOptions = Omit<TDatabaseOptions, 'populate'>;

export interface IDatabaseFindAllAggregateOptions
  extends IPaginationOptions,
    TDatabaseAggregateOptions {
  searchField?: string[];
}

export interface IDatabaseGetTotalAggregateOptions extends TDatabaseOptions {
  field?: Record<string, string> | string;
  sumField?: string;
}

// find
export interface IDatabaseFindAllOptions
  extends IPaginationOptions,
    Omit<IDatabaseFindOneOptions, 'sort'> {
  searchField?: string[];
}

// create

export interface IDatabaseCreateOptions
  extends Omit<TDatabaseOptions, 'withDeleted' | 'populate'> {
  _id?: string;
}

// exist

export interface IDatabaseExistOptions extends TDatabaseOptions {
  excludeId?: string;
}

// soft delete

export type TDatabaseSoftDeleteOptions = Pick<
  IDatabaseFindOneOptions,
  'session' | 'populate'
>;

// restore delete

export type TDatabaseRestoreOptions = TDatabaseSoftDeleteOptions;

// bulk
export type TDatabaseManyOptions = TDatabaseOptions;

export type TDatabaseCreateManyOptions = Pick<
  IDatabaseFindOneOptions,
  'session'
>;

export type TDatabaseSoftDeleteManyOptions = Pick<
  IDatabaseFindOneOptions,
  'session' | 'populate'
>;

export type TDatabaseRestoreManyOptions = Pick<
  IDatabaseFindOneOptions,
  'session' | 'populate'
>;
