// given an array type, return the typeof a single element
export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;
