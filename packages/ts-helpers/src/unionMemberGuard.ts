export function makeUnionMemberGuard<T, K extends keyof T, V extends string & T[K]>(
  k: K,
  v: V
): (o: T) => o is Extract<T, Record<K, V>> {
  return (o: T): o is Extract<T, Record<K, V>> => {
    return o[k] === v;
  };
}

export function makeGraphqlUnionMemberGuard<
  T extends { __typename: string },
  K extends keyof T,
  V extends string & T[K],
>(v: V) {
  return makeUnionMemberGuard<T, K, V>("__typename" as K, v);
}
