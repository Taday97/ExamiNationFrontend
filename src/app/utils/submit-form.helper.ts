import { FormGroup } from '@angular/forms';
import { FormErrorService } from '@shared/services/form-error.service';

export async function submitForm<T>(
  form: FormGroup,
  task: () => Promise<T>,
  notificationService: {
    success: (msg: string) => void;
    error: (msg: string) => void;
  },
  successMsg: string,
  errorMsg: string,
  formErrorService: FormErrorService,
  setGlobalError: (msg: string) => void
): Promise<T | undefined> {
  form.markAllAsTouched();
  if (!form.valid) return;

  try {
    const result = await task();
    notificationService.success(successMsg);
    return result;
  } catch (err: any) {
    const validationErrors = err?.error?.errors;
    if (validationErrors) {
      formErrorService.setBackendErrors(form, validationErrors, setGlobalError);
    } else {
      notificationService.error(errorMsg);
      setGlobalError(err?.error?.message || 'Unexpected error');
    }
    return undefined;
  }
}
