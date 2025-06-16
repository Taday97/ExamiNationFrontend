export interface PagesResponse<T> {
  success: boolean;
  message: string;
  errors: any[];
  data: T;
}
