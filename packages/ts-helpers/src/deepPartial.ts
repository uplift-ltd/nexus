// given a type, allow recursive partialness
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
