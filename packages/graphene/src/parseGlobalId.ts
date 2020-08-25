export function parseGlobalId(globalId: string): { name: string; id: string } {
  const [name, id] = atob(globalId).split(/:(.+)/);
  return { name, id };
}
