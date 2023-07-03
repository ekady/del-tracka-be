import { QueryWithHelpers } from 'mongoose';
import { PaginationOptions } from 'src/shared/interfaces/pagination.interface';
import { DatabaseFindOneOptions } from 'src/common/database/interfaces/database.interface';

const paginationOptions = <T, V = T>(
  model: QueryWithHelpers<T, V>,
  options: PaginationOptions & DatabaseFindOneOptions,
) => {
  const { limit, page, disablePagination, sort, select, session, projection } =
    options;

  if (options) model.select(select);
  if (!disablePagination) {
    const skip = (page - 1 >= 0 ? page - 1 : 0) * Number(limit);
    model.limit(Number(limit)).skip(skip);
  }
  if (sort) model.sort(sort);
  if (session) model.session(session);
  if (projection) model.projection(projection);
};

export default paginationOptions;
