export function toGlobalId(typename: string, id: number | string): string {
  return btoa(`${typename}:${id}`);
}
