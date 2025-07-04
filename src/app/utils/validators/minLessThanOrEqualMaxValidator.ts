import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export const minLessThanOrEqualMaxValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const min = group.get('minScore')?.value;
  const max = group.get('maxScore')?.value;

  if (min != null && max != null && min > max) {
    return { minLessThanOrEqualMax: 'Minimum Score must be less than to Maximum Score.' };
  }
  return null;
};
