export function toGlobalId(typename: string, id: string | number): string {
  return btoa(`${typename}:${id}`);
}
