import { EENUM_PAGINATION_AVAILABLE_SORT_TYPE } from '../enums/pagination.enum';

export type TPaginationSort = Record<
  string,
  EENUM_PAGINATION_AVAILABLE_SORT_TYPE
>;

export interface IPaginationOptions {
  limit: number;
  page: number;
  search?: string;
  sort?: TPaginationSort;
  disablePagination?: boolean;
}

export interface IPaginationResponse<T> {
  data: T;
  pagination: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
}

export interface IPaginationFilterOptions {
  required?: boolean;
}

export interface IPaginationFilterDateOptions extends IPaginationFilterOptions {
  asEndDate?: {
    moreThanField: string;
  };
}

export interface IPaginationFilterStringOptions
  extends IPaginationFilterOptions {
  lowercase?: boolean;
}
