// Converts an array of strings into a discriminated type union.
export type ArrayToUnion<T extends readonly string[]> = T[number];
