export interface ApiResponse<T> {
  success: boolean;
  message: string;
  errors: any[];
  data: T;
}
