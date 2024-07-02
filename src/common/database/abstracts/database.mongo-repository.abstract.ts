import {
  Document,
  Model,
  PipelineStage,
  PopulateOptions,
  Types,
} from 'mongoose';

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
} from '../interfaces/database.interface';
import { IDatabaseRepositoryAbstract } from '../interfaces/database.repository.interface';

import { EDatabasePaginationOptionDefault } from '../enums/database.enum';

import paginationOptions from 'src/shared/helpers/pagination-options.helper';

export abstract class DatabaseMongoRepositoryAbstract<T extends Document>
  implements IDatabaseRepositoryAbstract<T>
{
  protected _repository: Model<T>;
  protected _populateOnFind?: PopulateOptions | PopulateOptions[];

  constructor(
    repository: Model<T>,
    populateOnFind?: PopulateOptions | PopulateOptions[],
  ) {
    this._repository = repository;
    this._populateOnFind = populateOnFind;
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<IPaginationResponse<T[]>> {
    const {
      search,
      searchField,
      withDeleted,
      select,
      disablePagination,
      sort,
      populate,
      session,
      projection,
      limit = EDatabasePaginationOptionDefault.Limit,
      page = EDatabasePaginationOptionDefault.Page,
    } = options ?? {};

    if (search && searchField?.length) {
      const orConditions = searchField.map((field) => ({
        [field]: { $regex: search, $options: 'ig' },
      }));
      find.$or = orConditions;
    }

    const findAll = this._repository.find(find);

    findAll.where('deletedAt').equals(withDeleted ? null : undefined);

    paginationOptions<Array<T>, T>(findAll, {
      select,
      disablePagination,
      sort,
      session,
      projection,
      limit,
      page,
    });

    if (populate) findAll.populate(this._populateOnFind);

    const [data, count] = await Promise.all([
      findAll.exec(),
      await this._repository.countDocuments({
        ...find,
        deletedAt: withDeleted ? { $ne: null } : { $eq: null },
      }),
    ]);

    const totalPages =
      disablePagination || count / limit <= 1 ? 1 : Math.ceil(count / limit);

    return {
      data,
      pagination: {
        limit: disablePagination ? count : Number(limit),
        page: disablePagination ? 1 : Number(page),
        total: count,
        totalPages,
      },
    };
  }

  async findAllAggregate<N>(
    pipeline: PipelineStage[],
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<IPaginationResponse<N[]>> {
    const {
      withDeleted,
      sort,
      search,
      searchField,
      disablePagination,
      limit = EDatabasePaginationOptionDefault.Limit,
      page = EDatabasePaginationOptionDefault.Page,
    } = options || {};

    if (withDeleted) {
      pipeline.unshift({
        $match: { deletedAt: { $ne: null } },
      });
    } else {
      pipeline.unshift({
        $match: { deletedAt: { $eq: null } },
      });
    }

    if (sort) {
      pipeline.push({ $sort: sort });
    }

    if (search && searchField?.length) {
      pipeline.unshift({
        $match: {
          $expr: {
            $or: searchField.map((field) => ({
              $regexMatch: { input: `$${field}`, regex: search, options: 'i' },
            })),
          },
        },
      });
    } else if (search) {
      pipeline.unshift({ $match: { $text: { $search: search } } });
    }

    const countQuery = this._repository
      .aggregate<{ count: number }>([...pipeline, { $count: 'count' }])
      .exec();
    const count = (await countQuery)?.[0]?.count || 0;

    let skip = 0;
    if (!disablePagination) {
      const skipValue = (page - 1 >= 0 ? page - 1 : 0) * Number(limit);
      skip = skipValue;
      pipeline.push({ $skip: skipValue });
      pipeline.push({ $limit: Number(limit) });
    }

    const aggregate = this._repository.aggregate<N>(pipeline);
    const data = await aggregate.exec();

    const totalPages =
      disablePagination || count / Number(limit) <= 1
        ? 1
        : Math.ceil(count / Number(limit));

    return {
      data,
      pagination: {
        limit: disablePagination ? count : limit,
        page: disablePagination ? 1 : skip + 1,
        total: count,
        totalPages,
      },
    };
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<T> {
    const findOne = this._repository.findOne(find);

    if (options?.withDeleted) findOne.where('deletedAt').ne(null);
    else findOne.where('deletedAt').equals(null);

    if (options?.select) findOne.select(options.select);

    if (options?.populate) findOne.populate(this._populateOnFind);

    if (options?.session) findOne.session(options.session);

    if (options?.sort) findOne.sort(options.sort);

    if (options?.projection) findOne.projection(options.projection);

    return findOne.exec();
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<T> {
    const findOne = this._repository.findById(_id);

    if (options?.withDeleted) findOne.where('deletedAt').ne(null);
    else findOne.where('deletedAt').equals(null);

    if (options?.select) findOne.select(options.select);

    if (options?.populate) findOne.populate(this._populateOnFind);

    if (options?.session) findOne.session(options.session);

    if (options?.sort) findOne.sort(options.sort);

    if (options?.projection) findOne.projection(options.projection);

    return findOne.exec();
  }

  async findOneAggregate<N>(
    pipeline: PipelineStage[],
    options?: TDatabaseAggregateOptions,
  ): Promise<N> {
    if (options?.withDeleted) {
      pipeline.unshift({
        $match: { deletedAt: { $ne: null } },
      });
    } else {
      pipeline.unshift({
        $match: { deletedAt: { $eq: null } },
      });
    }

    pipeline.push({ $limit: 1 });

    const aggregate = this._repository.aggregate<N>(pipeline);
    if (options?.session) aggregate.session(options.session);

    const findOne = await aggregate.exec();
    return findOne && findOne.length > 0 ? findOne[0] : undefined;
  }

  async getTotal(
    find?: Record<string, any>,
    options?: TDatabaseOptions,
  ): Promise<number> {
    const count = this._repository.countDocuments(find);

    if (options?.withDeleted) count.where('deletedAt').ne(null);
    else count.where('deletedAt').equals(null);

    if (options?.session) count.session(options.session);

    if (options?.populate) count.populate(this._populateOnFind);

    return count;
  }
  async getTotalAggregate(
    pipeline: PipelineStage[],
    options?: IDatabaseGetTotalAggregateOptions,
  ): Promise<number> {
    if (options?.withDeleted) {
      pipeline.unshift({
        $match: { deletedAt: { $ne: null } },
      });
    } else {
      pipeline.unshift({
        $match: { deletedAt: { $eq: null } },
      });
    }

    pipeline.push({
      $group: {
        _id: options?.field ? options.field : null,
        count: {
          $sum: options?.sumField ? options.sumField : 1,
        },
      },
    });

    const aggregate = this._repository.aggregate(pipeline);
    if (options?.session) aggregate.session(options.session);

    const count = await aggregate.exec();
    return count && count.length > 0 ? count[0].count : 0;
  }

  async exists(
    find: Record<string, any>,
    options?: IDatabaseExistOptions,
  ): Promise<boolean> {
    const exist = this._repository.exists({
      ...find,
      _id: {
        $nin: options?.excludeId ? options.excludeId : undefined,
      },
    });

    if (options?.withDeleted) exist.where('deletedAt').ne(null);
    else exist.where('deletedAt').equals(null);

    if (options?.session) exist.session(options.session);

    if (options?.populate) exist.populate(this._populateOnFind);

    const result = await exist.exec();
    return result ? true : false;
  }

  async aggregate<N>(
    pipeline: Record<string, any>[],
    options?: TDatabaseAggregateOptions,
  ): Promise<N[]> {
    if (options?.withDeleted) {
      pipeline.unshift({
        $match: { deletedAt: { $ne: null } },
      });
    } else {
      pipeline.unshift({
        $match: { deletedAt: { $eq: null } },
      });
    }

    const aggregate = this._repository.aggregate<N>(
      pipeline as PipelineStage[],
    );
    if (options?.session) aggregate.session(options.session);

    return aggregate;
  }

  async create<N>(data: N, options?: IDatabaseCreateOptions): Promise<T> {
    const dataCreate: Record<string, any> = data;
    if (options?._id) {
      dataCreate._id = new Types.ObjectId(options._id);
    }

    const create = await this._repository.create([dataCreate], {
      session: options ? options.session : undefined,
    });

    return create[0];
  }

  async updateOneById<N>(
    _id: string,
    data: N,
    options?: TDatabaseOptions,
  ): Promise<T> {
    const update = this._repository.findByIdAndUpdate(
      _id,
      { $set: data },
      { new: true },
    );

    if (options?.withDeleted) update.where('deletedAt').ne(null);
    else update.where('deletedAt').equals(null);

    if (options?.populate) update.populate(this._populateOnFind);

    if (options?.session) update.session(options.session);

    return update;
  }

  async updateOne<N>(
    find: Record<string, any>,
    data: N,
    options?: TDatabaseOptions,
  ): Promise<T> {
    const update = this._repository.findOneAndUpdate(
      find,
      { $set: data },
      { new: true },
    );

    if (options?.withDeleted) update.where('deletedAt').ne(null);
    else update.where('deletedAt').equals(null);

    if (options?.populate) update.populate(this._populateOnFind);

    if (options?.session) update.session(options.session);

    return update;
  }

  async deleteOne(
    find: Record<string, any>,
    options?: TDatabaseOptions,
  ): Promise<T> {
    const del = this._repository.findOneAndDelete(find, { new: true });

    if (options?.withDeleted) del.where('deletedAt').ne(null);
    else del.where('deletedAt').equals(null);

    if (options?.populate) del.populate(this._populateOnFind);

    if (options?.session) del.session(options.session);

    return del;
  }

  async deleteOneById(_id: string, options?: TDatabaseOptions): Promise<T> {
    const del = this._repository.findByIdAndDelete(_id, { new: true });

    if (options?.withDeleted) del.where('deletedAt').ne(null);
    else del.where('deletedAt').equals(null);

    if (options?.populate) del.populate(this._populateOnFind);

    if (options?.session) del.session(options.session);

    return del;
  }

  async softDeleteOneById(
    _id: string,
    options?: TDatabaseSoftDeleteOptions,
  ): Promise<T> {
    const del = this._repository
      .findByIdAndUpdate(
        _id,
        { $set: { deletedAt: new Date() } },
        { new: true },
      )
      .where('deletedAt')
      .equals(null);

    if (options?.populate) del.populate(this._populateOnFind);

    if (options?.session) del.session(options.session);

    return del.exec();
  }

  async softDeleteOne(
    find: Record<string, any>,
    options?: TDatabaseSoftDeleteOptions,
  ): Promise<T> {
    const del = this._repository
      .findOneAndUpdate(
        find,
        { $set: { deletedAt: new Date() } },
        { new: true },
      )
      .where('deletedAt')
      .equals(null);

    if (options?.populate) del.populate(this._populateOnFind);

    if (options?.session) del.session(options.session);

    return del;
  }

  async restore(_id: string, options?: TDatabaseRestoreOptions): Promise<T> {
    const rest = this._repository
      .findByIdAndUpdate(_id, { $set: { deletedAt: null } }, { new: true })
      .where('deletedAt')
      .exists(true);

    if (options?.populate) rest.populate(this._populateOnFind);

    if (options?.session) rest.session(options.session);

    return rest;
  }
}
