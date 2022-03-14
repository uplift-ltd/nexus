export type JsonParseReviverCallback = Parameters<typeof JSON.parse>[1];

export function safeJsonParse<Shape extends unknown>(jsonStr: string): Shape | undefined;
export function safeJsonParse<Shape extends unknown>(
  jsonStr: string,
  fallback: null | undefined,
  reviver: JsonParseReviverCallback
): Shape | undefined;
export function safeJsonParse<Shape extends unknown>(
  jsonStr: string,
  fallback: Shape,
  reviver?: JsonParseReviverCallback
): Shape;
export function safeJsonParse<Shape extends unknown>(
  jsonStr: string,
  fallback?: Shape,
  reviver?: JsonParseReviverCallback
) {
  try {
    return JSON.parse(jsonStr, reviver);
  } catch (err) {
    return fallback;
  }
}
