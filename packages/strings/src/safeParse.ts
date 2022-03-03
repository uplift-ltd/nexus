export type JsonParseReviverCallback = Parameters<typeof JSON.parse>[1];
export function safeJsonParse<Shape extends unknown>(
  jsonStr: string,
  fallback?: Shape,
  reviver?: JsonParseReviverCallback
): Shape | undefined {
  try {
    return JSON.parse(jsonStr, reviver);
  } catch (err) {
    return fallback;
  }
}
