export async function handle<T>(
  task: () => Promise<T>,
  onSuccess: string,
  notification: { success: (msg: string) => void; error: (msg: string) => void },
  onError?: string,
  options?: { suppressNotifications?: boolean }
): Promise<{ result?: T; validationErrors?: { [key: string]: string[] }; message?: string } | undefined> {
  try {
    const result = await task();
    if (!options?.suppressNotifications) {
      notification.success(onSuccess);
    }
    return { result };
  } catch (err: any) {
    let msg = onError ?? 'Unexpected error';
    let validationErrors;
    if (err?.error?.errors) {
      validationErrors = err.error.errors;
      msg = '';
    } else if (err?.error?.message) {
      msg = err.error.message;
    }

    if (!options?.suppressNotifications) {
      notification.error(msg || onError || 'Unexpected error');
      return undefined;
    } else {
      return { validationErrors, message: msg };
    }
  }
}
