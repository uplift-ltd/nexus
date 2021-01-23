// get values from environment with default fallback
export function env(key: string): string | undefined;
export function env(key: string, defaultValue: string): string;
export function env(key: string, defaultValue?: string) {
  return process.env[key] || defaultValue;
}
