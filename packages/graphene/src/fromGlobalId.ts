export function fromGlobalId(globalId: string): string {
  try {
    const [, id] = atob(globalId).split(/:(.+)/);
    return id || globalId;
  } catch (_err: unknown) {
    return globalId;
  }
}
