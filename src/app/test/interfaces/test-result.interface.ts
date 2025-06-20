import { TestType, Test } from '../../shared/interfaces/test.interface';
import { catchError } from 'rxjs';


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
  userEmail: null;
  testId: string;
  testName: string;
  score: number;
  completedAt: null;
  startedAt: Date;
  status: number;
}

export interface TestResultHistory {
  id: string;
  userId: string;
  userEmail: null;
  testId: string;
  testName: string;
  testType: TestType;
  testMaxScore: number;
  score: number;
  questionCount: number;
  answeredCount: number;
  progressPercentage: number| null;
  nextQuestionPage: number | null;
  completedAt: Date;
  startedAt: Date;
  status: TestResultStatus;
  categoryResults: CategoryResult[];
}
export enum TestResultStatus {
  InProgress = 0,
  Completed = 1,
  Abandoned = 3,
}

export interface CategoryResult {
  name:               string;
  code:               string;
  totalQuestions:     number;
  correctAnswers:     number;
  answeredQuestions:  number;
  percentageCorrect:  number;
  progressPercentage: number;
}
