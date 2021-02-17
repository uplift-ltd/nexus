import { ARRAY_CONNECTION_NAME } from "./constants";
import { parseGlobalId } from "./parseGlobalId";
import { toGlobalId } from "./toGlobalId";

export function bumpOrInitCursor(globalId: string | null | undefined, increment = 1): string {
  if (globalId) {
    const { id } = parseGlobalId(globalId);
    const num = Number(id);
    if (isNaN(num)) {
      throw new Error("Unable to bump cursor, id is not a number.");
    }
    return toGlobalId(ARRAY_CONNECTION_NAME, num + increment);
  }
  return toGlobalId(ARRAY_CONNECTION_NAME, 1);
}
