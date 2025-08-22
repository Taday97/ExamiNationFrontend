export function toDropdownOptions<T>(
  items: T[],
  labelField: keyof T,
  valueField: keyof T
): { label: string; value: any }[] {
  return items.map((item) => ({
    label: String(item[labelField]),
    value: item[valueField],
  }));
}
