import { Document, Model, PopulateOptions, Types } from 'mongoose';

import { IDatabaseBulkRepositoryAbstract } from 'src/common/database/interfaces/database.bulk.repository.interface';
import {
  TDatabaseCreateManyOptions,
  TDatabaseManyOptions,
  TDatabaseSoftDeleteManyOptions,
  TDatabaseRestoreManyOptions,
} from 'src/common/database/interfaces/database.interface';

export abstract class DatabaseMongoBulkRepositoryAbstract<T extends Document>
  implements IDatabaseBulkRepositoryAbstract
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

  async createMany<N>(
    data: N[],
    options?: TDatabaseCreateManyOptions,
  ): Promise<boolean> {
    const create = this._repository.insertMany(data, {
      session: options ? options.session : undefined,
    });

    try {
      await create;
      return true;
    } catch (err: any) {
      throw err;
    }
  }

  async deleteManyById(
    _id: string[],
    options?: TDatabaseManyOptions,
  ): Promise<boolean> {
    const map: Types.ObjectId[] = _id.map((val) => new Types.ObjectId(val));

    const del = this._repository.deleteMany({ _id: { $in: map } });

    if (options?.withDeleted) del.where('deletedAt').ne(null);
    else del.where('deletedAt').equals(null);

    if (options?.session) del.session(options.session);

    if (options?.populate) del.populate(this._populateOnFind);

    try {
      await del.exec();
      return true;
    } catch (err: any) {
      throw err;
    }
  }

  async deleteMany(
    find: Record<string, any>,
    options?: TDatabaseManyOptions,
  ): Promise<boolean> {
    const del = this._repository.deleteMany(find);

    if (options?.withDeleted) del.where('deletedAt').ne(null);
    else del.where('deletedAt').equals(null);

    if (options?.session) del.session(options.session);

    if (options?.populate) del.populate(this._populateOnFind);

    try {
      await del.exec();
      return true;
    } catch (err: any) {
      throw err;
    }
  }

  async softDeleteManyById(
    _id: string[],
    options?: TDatabaseSoftDeleteManyOptions,
  ): Promise<boolean> {
    const map: Types.ObjectId[] = _id.map((val) => new Types.ObjectId(val));

    const softDel = this._repository
      .updateMany({ _id: { $in: map } }, { $set: { deletedAt: new Date() } })
      .where('deletedAt')
      .equals(null);

    if (options?.session) softDel.session(options.session);

    if (options?.populate) softDel.populate(this._populateOnFind);

    try {
      await softDel.exec();
      return true;
    } catch (err: any) {
      throw err;
    }
  }

  async softDeleteMany(
    find: Record<string, any>,
    options?: TDatabaseSoftDeleteManyOptions,
  ): Promise<boolean> {
    const softDel = this._repository
      .updateMany(find, { $set: { deletedAt: new Date() } })
      .where('deletedAt')
      .equals(null);

    if (options?.session) softDel.session(options.session);

    if (options?.populate) softDel.populate(this._populateOnFind);

    try {
      await softDel.exec();
      return true;
    } catch (err: any) {
      throw err;
    }
  }

  async restore(
    _id: string[],
    options?: TDatabaseRestoreManyOptions,
  ): Promise<boolean> {
    const map: Types.ObjectId[] = _id.map((val) => new Types.ObjectId(val));

    const rest = this._repository
      .updateMany({ _id: { $in: map } }, { $set: { deletedAt: null } })
      .where('deletedAt')
      .exists(true);

    if (options?.session) rest.session(options.session);

    if (options?.populate) rest.populate(this._populateOnFind);

    try {
      await rest.exec();
      return true;
    } catch (err: any) {
      throw err;
    }
  }

  async updateMany<N>(
    find: Record<string, any>,
    data: N,
    options?: TDatabaseManyOptions,
  ): Promise<boolean> {
    const update = this._repository.updateMany(find, { $set: data });

    if (options?.withDeleted) update.where('deletedAt').ne(null);
    else update.where('deletedAt').equals(null);

    if (options?.session) update.session(options.session);

    if (options?.populate) update.populate(this._populateOnFind);

    try {
      await update.exec();
      return true;
    } catch (err: any) {
      throw err;
    }
  }
}
