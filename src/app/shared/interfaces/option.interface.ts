import { Filters } from './test.interface';

export interface OptionResponse {
  success: boolean;
  message: string;
  errors: any[];
  data: OptionData[];
}

export interface OptionPagesResponse {
  items: OptionData[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  sortBy: null;
  sortDescending: boolean;
  filters: Filters;
}

export interface OptionData {
  id: string| null;
  text: string;
  isCorrect: boolean;
  questionId: string | null;
  questionText: string | null;
}
