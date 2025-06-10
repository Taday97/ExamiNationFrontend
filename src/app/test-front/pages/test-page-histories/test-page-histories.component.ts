import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '@auth/services/auth.service';
import { HistoryCardComponent } from '@test/components/history-card/history-card.component';
import { TestResultService } from '@test/services/testResult.service';
import { map } from 'rxjs';
import testFrontRoutes from '../../test.front.routes';

@Component({
  selector: 'app-test-page-histories',
  imports: [CommonModule, HistoryCardComponent],
  templateUrl: './test-page-histories.component.html',
})
export class TestPageHistoriesComponent {
  testResultService = inject(TestResultService);
  authService = inject(AuthService);
  userId = computed(() => this.authService.user()?.id);

  
  testsResultHistoryResource = rxResource({
    request: () => ({ userId: this.userId()! }),
    loader: ({ request }) =>
      this.testResultService.getTestResultByUserId(request.userId).pipe(
        map((response) => {
          if (!response!.success) {
            throw new Error(
              response!.message || 'Failed to fetch test histories'
            );
          }
          return {
            data: response!.data,
            count: response!.data.length,
          };
        })
      ),
  });
}
