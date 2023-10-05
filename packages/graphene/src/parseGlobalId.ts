export function parseGlobalId(globalId: string): { id: string; name: string } {
  const [name, id] = atob(globalId).split(/:(.+)/);
  return { id, name };
}
