export function cloneObject<T>(object: T): T {
  return JSON.parse(JSON.stringify(object));
}
