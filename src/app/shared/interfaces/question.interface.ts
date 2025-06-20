import { Test } from './test.interface';

export interface QuestionsResponse {
  success: boolean;
  message: string;
  errors: any[];
  data: Data;
}

export interface Data {
  test: Test;
  questions: Questions;
}

export interface Questions {
  items: Question[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDescending: boolean;
  filters: Filters;
}

export interface Filters {
  testId: string;
}

export interface Question {
  options: Option[];
  id: string;
  text: string;
  type: number;
  testId: string;
  testName: string;
  cognitiveCategoryId: string;
  cognitiveCategoryName: string;
  cognitiveCategoryCode: string;
  questionNumber: number;
  score: number;
  selectedOptionId: string | null;
}

export interface Option {
  id: string;
  text: string;
}
export enum QuestionType {
  SingleChoice,
  MultipleChoice,
  OpenEnded,
  TrueFalse,
}
