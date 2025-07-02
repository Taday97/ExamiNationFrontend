import { Filters, TestType } from "./test.interface";



export interface CognitiveCategoryResponse {
  success: boolean;
  message: string;
  errors: any[];
  data: CognitiveCategory[];
}

export interface CognitiveCategory {
  id: string;
  name: string;
  code: string;
  description: string;
  testTypeId:TestType
  isCorrect: boolean;
}

export interface CognitiveCategoryPagesResponse {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  sortBy: null;
  sortDescending: boolean;
  filters: Filters;
  items: CognitiveCategory[];
}

