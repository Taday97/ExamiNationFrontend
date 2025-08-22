export interface UsersResponse {
  success: boolean;
  message: string;
  errors: any[];
  data: Users;
}

export interface Users {
  items: User[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  sortBy: null;
  sortDescending: boolean;
  filters?: { [key: string]: string };
}

export interface User {
  id: string;
  userName: string;
  password: string;
  email: string;
  emailConfirmed: boolean;
  roles: string[];
}
