export interface PaginationResult<T> {
  items: T[];
  totalItems: number;
  page: number;
  limit: number;
}
