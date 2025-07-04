import { Filters, TestType } from './test.interface';

export interface ScoreRangesResponse {
  success: boolean;
  message: string;
  errors: any[];
  data: ScoreRanges;
}

export interface ScoreRanges {
  items: ScoreRange[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  sortBy: null;
  sortDescending: boolean;
  filters: Filters;
}

export interface ScoreRange {
  id: string;
  testId: string;
  testName: string | null;
  testType: TestType;
  minScore: number;
  maxScore: number;
  classification: string;
  shortDescription: string;
  detailedExplanation: string;
  recommendations: string;
}
