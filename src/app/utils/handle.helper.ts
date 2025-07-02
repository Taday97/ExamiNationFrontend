export async function handle<T>(
  task: () => Promise<T>,
  onSuccess: string,
  notification: { success: (msg: string) => void; error: (msg: string) => void },
  onError?: string
): Promise<T | undefined> {
  try {
    const result = await task();
    notification.success(onSuccess);
    return result;
  } catch (err: any) {
    let msg = onError ?? 'Unexpected error';

    if (err?.error?.errors) {
      const errors = err.error.errors;
      const allErrors = Object.values(errors).flat();
      if (allErrors.length > 0) {
        msg = allErrors.join('\n');
      }
    } else if (err?.error?.message) {
      msg = err.error.message;
    }

    notification.error(msg);
    return undefined;
  }
}
