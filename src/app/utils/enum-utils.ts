
export function enumToOptions<T extends object>(e: T) {
  return Object.keys(e)
    .filter(key => isNaN(Number(key)))
    .map(key => ({
      label: camelCaseToWords(key),
      value: (e as any)[key],
    }));
}


export function camelCaseToWords(value: string): string {
  if (!value) return value;
  return value.replace(/([a-z])([A-Z])/g, '$1 $2');
}
