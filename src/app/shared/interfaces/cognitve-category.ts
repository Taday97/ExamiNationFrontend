import { TestType } from "./test.interface";


export interface CognitiveCategoryResponse {
  items:          CognitiveCategory[];
  totalCount:     number;
  pageNumber:     number;
  pageSize:       number;
  sortBy:         null;
  sortDescending: boolean;
  filters:        Filters;
}

export interface Filters {
}
export interface CognitiveCategory {
  id: string;
  name: string;
  code: string;
  description: string;
  testTypeId:TestType
  isCorrect: boolean;
}


