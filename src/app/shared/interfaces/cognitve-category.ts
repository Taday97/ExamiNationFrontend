import { Filters, TestType } from './test.interface';

export interface CognitiveCategoriesResponse {
  success: boolean;
  message: string;
  errors: any[];
  data: CognitiveCategory[];
}

export interface CognitiveCategories {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  sortBy: null;
  sortDescending: boolean;
  filters: Filters;
  items: CognitiveCategory[];
}

export interface CognitiveCategory {
  id: string;
  name: string;
  code: string;
  description: string;
  testTypeId: TestType;
}
