import { existsSync, readFileSync } from "fs";
import path from "path";

export type FormatResolution = { command: string } | { skip: "none" | "incapable" };

const PRETTIER_CONFIG_FILES = [
  ".prettierrc",
  ".prettierrc.json",
  ".prettierrc.yml",
  ".prettierrc.yaml",
  ".prettierrc.json5",
  ".prettierrc.js",
  ".prettierrc.cjs",
  ".prettierrc.mjs",
  ".prettierrc.ts",
  ".prettierrc.toml",
  "prettier.config.js",
  "prettier.config.cjs",
  "prettier.config.mjs",
  "prettier.config.ts",
];

const DPRINT_CONFIG_FILES = ["dprint.json", "dprint.jsonc", ".dprint.json", ".dprint.jsonc"];

// biome (and oxide) can't format YAML; detected only to explain the skip.
// Oxide is intentionally omitted — its formatter config is still stabilizing.
const INCAPABLE_CONFIG_FILES = ["biome.json", "biome.jsonc"];

function hasAny(dir: string, files: string[]): boolean {
  return files.some((file) => existsSync(path.join(dir, file)));
}

function hasPrettierPackageJsonKey(dir: string): boolean {
  const pkgPath = path.join(dir, "package.json");
  if (!existsSync(pkgPath)) return false;
  try {
    return JSON.parse(readFileSync(pkgPath, "utf-8")).prettier != null;
  } catch {
    return false;
  }
}

// Walk from startDir up to the repo root (a dir containing `.git`) or the
// filesystem root. Mirrors how formatters resolve their own config, so a
// monorepo-root `.prettierrc` is found from a nested package directory.
function* dirsUpward(startDir: string): Generator<string> {
  let dir = path.resolve(startDir);
  for (;;) {
    yield dir;
    if (existsSync(path.join(dir, ".git"))) break;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
}

export function resolveFormatCommand(projectDir: string, configFormat?: string): FormatResolution {
  if (configFormat) return { command: configFormat };

  let sawIncapable = false;
  for (const dir of dirsUpward(projectDir)) {
    if (hasAny(dir, PRETTIER_CONFIG_FILES) || hasPrettierPackageJsonKey(dir)) {
      return { command: "prettier --write {file}" };
    }
    if (hasAny(dir, DPRINT_CONFIG_FILES)) {
      return { command: "dprint fmt {file}" };
    }
    if (hasAny(dir, INCAPABLE_CONFIG_FILES)) {
      sawIncapable = true;
    }
  }

  return { skip: sawIncapable ? "incapable" : "none" };
}

const SET_FORMAT_HINT = 'Set "sammy.format" in package.json';

export function formatSkipMessage(skip: "none" | "incapable", appspecName: string): string {
  return skip === "incapable"
    ? `⚠ Detected a formatter that can't format YAML (biome). Wrote ${appspecName} ` +
        `unformatted. ${SET_FORMAT_HINT} to use prettier/dprint.`
    : `⚠ No YAML-capable formatter detected (prettier/dprint). Wrote ${appspecName} ` +
        `unformatted. ${SET_FORMAT_HINT} to configure one.`;
}

/** Split a `format` command into its executable and args, substituting `{file}`. */
export function buildFormatArgv(command: string, appspecName: string): [string, string[]] {
  const [cmd, ...rest] = command.split(/\s+/).filter(Boolean);
  return [cmd, rest.map((arg) => (arg === "{file}" ? appspecName : arg))];
}
