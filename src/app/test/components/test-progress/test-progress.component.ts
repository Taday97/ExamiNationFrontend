import {
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  output,
  Output,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuestionsService } from '@shared/services/questions.service';
import { TestResultService } from '@test/services/testResult.service';
import { map } from 'rxjs';

@Component({
  selector: 'test-progress',
  imports: [RouterLink],
  templateUrl: './test-progress.component.html',
})
export class TestProgressComponent {
  @Output() optionSelect = new EventEmitter<{
    results: boolean | null;
  }>();
  currentQuestion = input.required<number>();
  totalQuestion = input.required<number>();
  time = input.required<Signal<number>>();
  router= inject(Router);
  testResultService = inject(TestResultService)

  percent = computed(() => {
    return (this.currentQuestion() / this.totalQuestion()) * 100;
  });

  formattedTime = computed(() => {
    const totalSeconds = this.time();
    const minutes = Math.floor(totalSeconds() / 60);
    const seconds = totalSeconds() % 60;
    return `${this.pad(minutes)}:${this.pad(seconds)}`;
  });

  private pad(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  onResults():void {
    if(this.testResultService.resultId !== null){
    this.router.navigate(['/test-result', this.testResultService.resultId(), 'details']);
    }
  }
}
