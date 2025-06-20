import { Component, input } from '@angular/core';
import {  RouterLink } from '@angular/router';
import { Test, TestType } from '@shared/interfaces/test.interface';
import { CommonModule } from '@angular/common';
import { TestImagePipe } from '@test/pipes/test-image.pipe';
@Component({
  selector: 'test-card',
  imports: [RouterLink,CommonModule,TestImagePipe],
  templateUrl: './test-card.component.html',
})
export class TestCardComponent {
  test = input.required<Test>();
  testType = TestType;
}
