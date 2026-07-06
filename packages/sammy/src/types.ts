export interface SammyConfig {
  apps: Record<string, string>;
  context: string;
  /**
   * Command used to format the downloaded appspec YAML. `{file}` is replaced
   * with the appspec filename; if omitted, the command runs unchanged (no
   * filename is appended). When unset, sammy auto-detects prettier/dprint.
   */
  formatCmd?: string;
}
