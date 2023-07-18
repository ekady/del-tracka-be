import { ENUM_PAGINATION_AVAILABLE_SORT_TYPE } from '../enums/pagination.enum';

export type PaginationSort = Record<
  string,
  ENUM_PAGINATION_AVAILABLE_SORT_TYPE
>;

export interface PaginationOptions {
  limit: number;
  page: number;
  search?: string;
  sort?: PaginationSort;
  disablePagination?: boolean;
}

export interface PaginationResponse<T> {
  data: T;
  pagination: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
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