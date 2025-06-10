import { Component, inject, Input, input } from '@angular/core';
import { CategoryResult } from '../../../test/interfaces/test-result.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-performance-card-category',
  imports: [CommonModule],
  templateUrl: './performance-card-category.component.html',
})
export class PerformanceCardCategoryComponent {
  category = input.required<CategoryResult>();
  index = input.required<number>();
  @Input() size: 'default' | 'small' = 'default';

  getRandomColor(seed: number): string {
    const categoryColors = [
      '#4DA3FF',
      '#B266FF',
      '#7B61FF',
      '#FF7F2A',
      '#56CC9D',
      '#FF6B81',
      '#FFD93D',
      '#00C1D4',
      '#FFA69E',
      '#845EC2', 
    ];
    return categoryColors[seed % categoryColors.length];
  }
}
