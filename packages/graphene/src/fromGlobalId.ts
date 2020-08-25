export function fromGlobalId(globalId: string): string {
  try {
    const [, id] = atob(globalId).split(/:(.+)/);
    return id || globalId;
  } catch (err) {
    return globalId;
  }
}
