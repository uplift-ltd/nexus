type StringableType = { toString: () => string };

const isStringable = (variableToCheck: unknown): variableToCheck is StringableType => {
  return Boolean(
    variableToCheck &&
      typeof variableToCheck === "object" &&
      typeof variableToCheck.toString === "function"
  );
};

export function ensureError(err: unknown, fallbackErrorMsg = "Encountered an unknown error.") {
  if (err) {
    if (err instanceof Error) return err;
    if (typeof err === "string") return new Error(err);
    if (isStringable(err)) return new Error(err.toString());
  }

  return new Error(fallbackErrorMsg);
}
