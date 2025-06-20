export interface TestsResponse {
  success: boolean;
  message: string;
  errors: any[];
  data: Test[];
}

export interface Test {
  id: string;
  name: string;
  description: string;
  type: TestType;
  createdAt: Date;
  imageUrl: string;
}

export enum TestType {
  IQ = 0,
  Personality = 1,
  Skills = 2,
  Other = 3,
}

export interface TestPagesResponse {
  success: boolean;
  message: string;
  errors: any[];
  data: Data;
}

export interface Data {
  items: Test[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  sortBy: null;
  sortDescending: boolean;
  filters: Filters;
}

export interface Filters {
  type: string;
}

export interface Test {
  id: string;
  name: string;
  description: string;
  type: TestType;
  createdAt: Date;
  imageUrl: string;
}
