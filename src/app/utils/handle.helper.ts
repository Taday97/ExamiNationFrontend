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
    const msg = err?.error?.message ?? onError ?? 'Unexpected error';
    notification.error(msg);
    return undefined;
  }
}
