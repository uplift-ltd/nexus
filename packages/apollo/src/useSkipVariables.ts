export function useSkipVariables<TVars>(
  variables: TVars
): [boolean, { [K in keyof TVars]: NonNullable<TVars[K]> }] {
  const skip = Object.values(variables).some((value) => value === null || value === undefined);
  return [skip, variables as { [K in keyof TVars]: NonNullable<TVars[K]> }];
}
