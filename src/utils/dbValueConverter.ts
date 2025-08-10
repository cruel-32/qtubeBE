export function convertNullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

export function convertUndefinedToNull<T>(value: T | undefined): T | null {
  return value === undefined ? null : value;
}
