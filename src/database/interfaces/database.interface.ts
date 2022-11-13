import { ClientSession } from 'mongoose';
import { PaginationOptions } from 'src/common/interfaces/pagination.interface';

// find one
export interface DatabaseFindOneOptions
  extends Pick<PaginationOptions, 'sort'> {
  select?: Record<string, number> | Record<string, string>;
  populate?: boolean;
  session?: ClientSession;
  withDeleted?: boolean;
  projection?: Record<string, string | number | boolean>;
}

export type DatabaseOptions = Pick<
  DatabaseFindOneOptions,
  'session' | 'withDeleted' | 'populate'
>;

// aggregate

export type DatabaseAggregateOptions = Omit<DatabaseOptions, 'populate'>;

export interface DatabaseFindAllAggregateOptions
  extends PaginationOptions,
    DatabaseAggregateOptions {}

export interface DatabaseGetTotalAggregateOptions extends DatabaseOptions {
  field?: Record<string, string> | string;
  sumField?: string;
}

// find
export interface DatabaseFindAllOptions
  extends PaginationOptions,
    Omit<DatabaseFindOneOptions, 'sort'> {}

// create

export interface DatabaseCreateOptions
  extends Omit<DatabaseOptions, 'withDeleted' | 'populate'> {
  _id?: string;
}

// exist

export interface DatabaseExistOptions extends DatabaseOptions {
  excludeId?: string;
}

// soft delete

export type DatabaseSoftDeleteOptions = Pick<
  DatabaseFindOneOptions,
  'session' | 'populate'
>;

// restore delete

export type DatabaseRestoreOptions = DatabaseSoftDeleteOptions;

// bulk
export type DatabaseManyOptions = DatabaseOptions;

export type DatabaseCreateManyOptions = Pick<DatabaseFindOneOptions, 'session'>;

export type DatabaseSoftDeleteManyOptions = Pick<
  DatabaseFindOneOptions,
  'session' | 'populate'
>;

export type DatabaseRestoreManyOptions = Pick<
  DatabaseFindOneOptions,
  'session' | 'populate'
>;
