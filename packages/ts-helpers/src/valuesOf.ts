// Turns an object's values into a type union of it's values
export type ValuesOf<T> = T[keyof T];
