import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  TestResultHistory,
  TestResultStatus,
} from '@test/interfaces/test-result.interface';
import { TestType } from '@shared/interfaces/test.interface';
import { PerformanceCardCategoryComponent } from '../../../test-front/components/performance-card-category/performance-card-category.component';
import { CamelCaseToSpacesPipe } from "../../../shared/pipes/camelCaseToSpaces.pipe";

@Component({
  selector: 'app-history-card',
  imports: [
    DatePipe,
    CommonModule,
    RouterLink,
    PerformanceCardCategoryComponent,
    CamelCaseToSpacesPipe
],
  templateUrl: './history-card.component.html',
})
export class HistoryCardComponent {
  constructor(private router: Router) {}
  testResult = input.required<TestResultHistory>();
  testType = TestType;
  testResultStatus = TestResultStatus;
  statusClassMap: Record<TestResultStatus, string> = {
    [TestResultStatus.Completed]: 'bg-green-100 text-green-800',
    [TestResultStatus.InProgress]: 'bg-yellow-100 text-yellow-800',
    [TestResultStatus.Abandoned]: 'bg-red-100 text-red-800',
  };
  percent = computed(() => {
    return (this.testResult().score / this.testResult().testMaxScore) * 100;
  });
  getTestLink(): any {
    const result = this.testResult();

    if (result.status === this.testResultStatus.Completed) {
      return ['/test-result', result.id, 'details'];
    } else {
      return this.router.createUrlTree(['/test', result.testId, 'start'], {
        queryParams: { page: result.nextQuestionPage },
      });
    }
  }
  getRandomColor(seed: number): string {
    const categoryColors = [
      '#4DA3FF', // Azul cielo (Logical Reasoning)
      '#B266FF', // Morado suave (Numerical Aptitude)
      '#7B61FF', // Violeta profundo (Pattern Recognition)
      '#FF7F2A', // Naranja brillante (Processing Speed)
      '#56CC9D', // Verde esmeralda claro
      '#FF6B81', // Coral rosado
      '#FFD93D', // Amarillo pastel brillante
      '#00C1D4', // Azul turquesa suave
      '#FFA69E', // Rosa salmón
      '#845EC2', // Púrpura vivo
    ];
    return categoryColors[seed % categoryColors.length];
  }
}
