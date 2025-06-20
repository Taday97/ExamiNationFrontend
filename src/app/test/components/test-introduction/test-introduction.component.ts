import { Component, input } from '@angular/core';
import { Test, TestType } from '@shared/interfaces/test.interface';

@Component({
  selector: 'test-introduction',
  imports: [],
  templateUrl: './test-introduction.component.html',
})
export class TestIntroductionComponent {
   test = input.required<Test>();
   questionsNumber = input.required<number>();
   testType = TestType;
}
