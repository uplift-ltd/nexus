export function makeUnionMemberGuard<T, K extends keyof T, V extends string & T[K]>(
  k: K,
  v: V
): (o: T) => o is Extract<T, Record<K, V>> {
  return (o: T): o is Extract<T, Record<K, V>> => {
    return o[k] === v;
  };
}
