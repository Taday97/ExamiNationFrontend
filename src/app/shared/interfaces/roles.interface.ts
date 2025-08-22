export interface RolesResponse {
  success: boolean;
  message: string;
  errors: any[];
  data: Rol[];
}

export interface Roles {
  items: Rol[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  sortBy: null;
  sortDescending: boolean;
  filters?: { [key: string]: string };
}

export interface Rol {
  id: string;
  name: string;
  description: string;
  userCount: number;
}
