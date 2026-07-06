# Sammy: Configurable / Auto-detected Formatter

**Date:** 2026-07-06 **Status:** Design agreed, not yet implemented

## Problem

`sammy appspec:get` downloads a DigitalOcean appspec via `doctl`, writes it to `appspec.<env>.yml`,
then formats it so the committed file has consistent, low-diff-noise formatting. The format step is
hardcoded:

```ts
// packages/sammy/src/sammy.ts:33
const prettier = await execa("./node_modules/.bin/prettier", ["--write", appspecName]);
```

This breaks in two independent ways:

1. **Binary resolution** — the relative path `./node_modules/.bin/prettier` only exists in an npm
   single-package layout. It is missing in every monorepo, in all of pnpm, and in yarn PnP.
2. **Formatter capability** — the file is YAML, and biome/oxide projects have no YAML formatter at
   all.

## Complication matrices

### Matrix 1 — Binary resolution (`./node_modules/.bin/X`)

| PM + layout                | Hardcoded path        | Why                        | Correct resolution                       |
| -------------------------- | --------------------- | -------------------------- | ---------------------------------------- |
| npm · single               | ✅ usually            | bin in local `.bin`        | local / PATH                             |
| npm · monorepo (from pkg)  | ❌ often              | hoisted to **root** `.bin` | walk up `node_modules/.bin`              |
| yarn classic · single      | ✅                    | local `.bin`               | local                                    |
| yarn classic · monorepo    | ❌                    | hoisted to root            | walk up                                  |
| **yarn berry (PnP) · any** | ❌ **never**          | **no `node_modules`**      | `yarn exec` — **unsupported, see below** |
| pnpm · single              | ⚠️ only if direct dep | strict, non-hoisted        | local                                    |
| pnpm · monorepo            | ❌ usually            | no hoist                   | walk up / `pnpm exec`                    |

Near-universal fix: **`execa(cmd, args, { preferLocal: true })`**. execa walks `node_modules/.bin`
up the directory tree and falls back to PATH, covering npm / yarn-classic / pnpm in both single and
monorepo layouts.

### Matrix 2 — Formatter capability

| Formatter           | Formats YAML?                  | Write invocation          |
| ------------------- | ------------------------------ | ------------------------- |
| prettier            | ✅ native                      | `prettier --write {file}` |
| dprint              | ✅ via yaml plugin             | `dprint fmt {file}`       |
| biome               | ❌ JS/TS/JSON/CSS/GraphQL only | —                         |
| oxc / oxfmt (oxide) | ❌ JS/TS, experimental         | —                         |

Only **prettier** and **dprint** can format YAML, so those are the only two tools auto-detection
targets, and prettier remains the only sensible zero-config default.

## Explicit non-goal: yarn PnP

Yarn Plug'n'Play has no `node_modules`, so `preferLocal` cannot resolve a bin. Supporting it would
require detecting the PM and prefixing `yarn exec`. **We are not supporting yarn PnP.** In a PnP
project the formatter simply won't resolve and sammy takes the graceful-skip path (logs, writes the
file unformatted, exits 0). If needed later, users can set an explicit `format` command that
includes the `yarn exec` prefix.

## Design

### Config

Add an optional `format` field to the sammy config (in `package.json`):

```jsonc
"sammy": {
  "format": "biome format --write {file}"  // optional
}
```

- A **command string** with a `{file}` placeholder. Sammy substitutes the appspec filename; if
  `{file}` is absent, the filename is appended as the last arg.
- `SammyConfig` gains `format?: string` (`packages/sammy/src/types.ts`).

### Resolution order — `resolveFormatCommand(projectDir): string | null`

1. `config.format` present → use it verbatim.
2. else detect a YAML-capable formatter in `projectDir` (the dir of the `package.json` that
   `read-pkg-up` resolved):
   - prettier config or dependency present → `prettier --write {file}`
   - else dprint config (`dprint.json` / `dprint.jsonc`) → `dprint fmt {file}`
3. else → `null` (skip).

### Invocation

```ts
const command = resolveFormatCommand(projectDir);
if (!command) {
  console.info(
    `⚠ No YAML-capable formatter detected (prettier/dprint). ` +
      `Wrote ${appspecName} unformatted. Set "sammy.format" in package.json to configure one.`
  );
} else {
  const parts = command.split(/\s+/);
  const args = parts.slice(1).map((a) => (a === "{file}" ? appspecName : a));
  if (!command.includes("{file}")) args.push(appspecName);
  try {
    const res = await execa(parts[0], args, { preferLocal: true });
    console.info(res.stdout || `Wrote ${appspecName}`);
  } catch (err) {
    console.warn(
      `⚠ Formatter "${parts[0]}" failed: ${err.shortMessage ?? err}. ` +
        `Wrote ${appspecName} unformatted.`
    );
  }
}
```

Notes:

- Whitespace `split` is sufficient: `appspecName` (`appspec.<env>.yml`) has no spaces, and the
  command comes from trusted local config. No shell is invoked.
- Formatting runs in its **own** try/catch so a formatter failure never aborts `appspec:get` — the
  YAML is already written and the download succeeded.

### Graceful skip — always exit 0, always log

| Situation                                  | Log                                                                                                     |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| No YAML-capable formatter detected         | `⚠ No YAML-capable formatter detected (prettier/dprint). Wrote <file> unformatted. Set "sammy.format"…` |
| biome/oxide detected, nothing YAML-capable | same skip, optionally hinting biome/oxide can't format YAML                                             |
| Formatter resolved but errored             | `⚠ Formatter "<cmd>" failed: <msg>. Wrote <file> unformatted.`                                          |

## Testing

- Unit: `resolveFormatCommand` returns explicit config, detected prettier, detected dprint, and
  `null` in a bare dir.
- Unit: `{file}` substitution and append-when-absent.
- Integration: `appspec:get` in a monorepo-style fixture (nested package, bin at a parent
  `node_modules/.bin`) resolves via `preferLocal`.
- Integration: formatter-failure and no-formatter paths both exit 0 and log.

## Open questions

- Detect prettier by config file only, or also by presence in `dependencies`? (Config-file-only is
  simpler and avoids a false positive when prettier is a transitive dep that isn't actually wired
  up.)
- Should the skip message for a detected-but-incapable formatter (biome/oxide) be distinct, or is
  one generic message enough? Distinct adds detection code for no functional gain.
