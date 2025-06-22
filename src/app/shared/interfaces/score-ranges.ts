import { Filters, TestType } from "./test.interface";


export interface ScoreRangesResponse {
  items:          ScoreRange[];
  totalCount:     number;
  pageNumber:     number;
  pageSize:       number;
  sortBy:         null;
  sortDescending: boolean;
  filters:        Filters;
}



export interface ScoreRange {
  id:                  string;
  testId:              string;
  testName:            null;
  testType:            TestType;
  minScore:            number;
  maxScore:            number;
  classification:      string;
  shortDescription:    string;
  detailedExplanation: string;
  recommendations:     string;
}
