export interface Options{
  filters: { [key: string]: string };
  sortBy?: string;
  sortDescending: boolean,
  pageNumber?: number;
  pageSize?: number;
}
