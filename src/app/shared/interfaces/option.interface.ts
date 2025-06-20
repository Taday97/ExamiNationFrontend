import { Filters } from "./test.interface";

export interface OptionsResponse {
  items: Option[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  sortBy: null;
  sortDescending: boolean;
  filters: Filters;
}


export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  questionId: string;
  questionText: null;
}

