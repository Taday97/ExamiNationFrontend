import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
const base = environment.base;
@Pipe({
  name: 'testImage',
})
@Injectable({
  providedIn: 'root',
})
export class TestImagePipe implements PipeTransform {
  transform(value: string | null, ...args: any[]): string {
    if (!value) {
      return './assests/images/no-image.jpg';
    }
    if (typeof value === 'string') {
      return `${base}${value}`;
    }
    return `${base}${value}`;
  }
}
