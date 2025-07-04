import { AbstractControl, ValidationErrors, ValidatorFn, FormArray } from '@angular/forms';

export function atLeastOneCorrectOptionValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormArray)) {
      return null;
    }

    const hasAtLeastOneCorrect = control.controls.some(
      (optionControl) => optionControl.get('isCorrect')?.value === true
    );

    return hasAtLeastOneCorrect ? null : { noCorrectOptionSelected: true };
  };
}
