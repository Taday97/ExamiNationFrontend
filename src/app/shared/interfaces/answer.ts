import { Filters } from "./test.interface";



export interface AnswerResults {
  items:          Item[];
  totalCount:     number;
  pageNumber:     number;
  pageSize:       number;
  sortBy:         null;
  sortDescending: boolean;
  filters:        Filters;
}


export interface Item {
  testResultId:      string;
  questionNumber:    number;
  questionText:      string;
  userAnswerText:    string;
  correctAnswerText: string;
  isCorrect:         boolean;
}
