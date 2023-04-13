import { parseGlobalId } from "./parseGlobalId.js";
import { toGlobalId } from "./toGlobalId.js";

export function bumpGlobalId(globalId: string, increment = 1): string {
  const { name, id } = parseGlobalId(globalId);
  const num = Number(id);
  if (isNaN(num)) {
    throw new Error("Unable to bump globalId, id is not a number.");
  }
  return toGlobalId(name, num + increment);
}
