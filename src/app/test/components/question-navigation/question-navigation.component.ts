import { Component, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'question-navigation',
  imports: [RouterLink],
  templateUrl: './question-navigation.component.html',
})
export class QuestionNavigationComponent {
  pages = input(0);
  pageBlockSize = 10;
  currentPage = input<number>(1);
  activePage = linkedSignal(this.currentPage);

  private currentBlockStart = computed(() => {
    const currentPage = this.activePage();
    return (
      Math.floor((currentPage - 1) / this.pageBlockSize) * this.pageBlockSize +
      1
    );
  });

  private currentBlockEnd = computed(() => {
    const start = this.currentBlockStart();
    return Math.min(start + this.pageBlockSize - 1, this.pages());
  });

  getPagesList = computed(() => {
    const start = this.currentBlockStart();
    const end = this.currentBlockEnd();
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  prevBlock() {
    if (this.activePage() > 1) {
      this.activePage.set(this.activePage() - this.pageBlockSize);
    }
  }

  nextBlock() {
    const maxPage = this.pages();
    if (this.activePage() + this.pageBlockSize <= maxPage) {
      this.activePage.set(this.activePage() + this.pageBlockSize);
    }
  }

  get disablePrevButton() {
    return this.activePage() === 1;
  }

  get disableNextButton() {
    return this.activePage() === this.pages();
  }

  prevPage() {
    if (this.activePage() > 1) {
      this.activePage.set(this.activePage() - 1);
    }
  }

  nextPage() {
    if (this.activePage() > 1 && this.activePage()< this.pages()) {
      this.activePage.set(this.currentPage() + 1);
    }
  }
}
