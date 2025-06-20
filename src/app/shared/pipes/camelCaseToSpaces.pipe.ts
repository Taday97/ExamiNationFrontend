import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelCaseToSpaces',
})
export class CamelCaseToSpacesPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;
    return value.replace(/([a-z])([A-Z])/g, '$1 $2');
  }
}
