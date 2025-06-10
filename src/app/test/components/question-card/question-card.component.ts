import {
  Component,
  computed,
  EventEmitter,
  input,
  Output,
  output,
  signal,
} from '@angular/core';
import { Question } from '@test/interfaces/question.interface';
import { SubmitAnswerRequest } from '../../interfaces/submitAnswer.interface';
import { NgClass } from '@angular/common';

@Component({
  selector: 'question-card',
  imports: [NgClass],
  templateUrl: './question-card.component.html',
})
export class QuestionCardComponent {
  question = input.required<Question>();
  @Output() optionSelect = new EventEmitter<SubmitAnswerRequest>();

  selectedOption = signal<string | null>(null);
  showSaveButton = computed(() => !!this.selectedOption());

  onOptionSelect(value: string) {
    this.selectedOption.set(value);
    this.onSave();
  }
  onSave() {
    this.optionSelect.emit({
      questionId: this.question().id,
      selectedOptionId: this.selectedOption()!,
    });
  }

  ngOnChanges() {
    this.selectedOption.set(this.question().selectedOptionId ?? null);
  }
}
