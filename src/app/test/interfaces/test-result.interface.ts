import { TestType, Test, Filters } from '@shared/interfaces/test.interface';

export interface TestResultSummary {
  testResultDto: TestResultDto;
  countQuestions: number;
  countAnswers: number;
  id: string;
  testId: string;
  testName: string;
  minScore: number;
  maxScore: number;
  classification: string;
  shortDescription: string;
  detailedExplanation: string;
  recommendations: string;
  categoryResults: CategoryResult[];
}

export interface TestResultDto {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  testId: string;
  testType: TestType;
  testName: string;
  score: number;
  testMaxScore: number;
  completedAt: Date | null;
  startedAt: Date;
  status: number;
}

export interface TestResultHistory {
  questionCount: number;
  answeredCount: number;
  nextQuestionPage: number;
  scoreMax: number;
  categoryResults: CategoryResult[];
  progressPercentage: number;
  id: string;
  userId: string;
  userName: null;
  userEmail: string;
  testId: string;
  testName: string;
  testType: number;
  testMaxScore: number;
  score: number;
  completedAt: Date;
  startedAt: Date;
  status: TestResultStatus;
}
export enum TestResultStatus {
  InProgress = 0,
  Completed = 1,
  Abandoned = 2,
}

export interface CategoryResult {
  name: string;
  code: string;
  totalQuestions: number;
  correctAnswers: number;
  answeredQuestions: number;
  percentageCorrect: number;
  progressPercentage: number;
}

export interface TestResultPagesResponse {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  sortBy: null;
  sortDescending: boolean;
  filters: Filters;
  items: TestResultHistory[];
}



