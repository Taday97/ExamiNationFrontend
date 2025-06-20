export interface QueryOptions{
  filters: { [key: string]: string };
  sortBy?: string;
  sortDescending: boolean,
  pageNumber?: number;
  pageSize?: number;
}
