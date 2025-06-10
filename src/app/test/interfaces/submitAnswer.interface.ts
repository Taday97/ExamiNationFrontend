export interface SubmitAnswerRequest {
  questionId:       string;
  selectedOptionId: string;
}
export interface TestResultResponse {
  id:        string;
  userId:    string;
  userEmail: null;
  testId:    string;
  testName:  string;
  score:     number;
  status:    number;
}
