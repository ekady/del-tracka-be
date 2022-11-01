import { ENUM_PAGINATION_AVAILABLE_SORT_TYPE } from '../enums/pagination.enum';

export type PaginationSort = Record<
  string,
  ENUM_PAGINATION_AVAILABLE_SORT_TYPE
>;

export interface PaginationOptions {
  limit: number;
  skip: number;
  sort?: PaginationSort;
}

export interface PaginationFilterOptions {
  required?: boolean;
}

export interface PaginationFilterDateOptions extends PaginationFilterOptions {
  asEndDate?: {
    moreThanField: string;
  };
}

export interface PaginationFilterStringOptions extends PaginationFilterOptions {
  lowercase?: boolean;
}
