import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormErrorService {
  setBackendErrors(
    form: FormGroup,
    errors?: { [key: string]: string[] },
    setGlobalError?: (msg: string) => void
  ) {
    errors = errors ?? {};

    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      if (control?.hasError('backend')) {
        control.setErrors(null);
      }
    });

    Object.entries(errors).forEach(([fieldName, messages]) => {
      const formKey = this.toCamelCase(fieldName);
      const control = form.get(formKey);

      if (control) {
        control.setErrors({ backend: messages.join(', ') });
      } else if (setGlobalError) {
        setGlobalError(messages.join(', '));
      }
    });
  }

  private toCamelCase(key: string): string {
    return key.replace(/^[A-Z]/, (m) => m.toLowerCase());
  }
}
