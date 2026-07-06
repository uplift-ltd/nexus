# Sammy: Configurable / Auto-detected Formatter

**Date:** 2026-07-06 **Status:** Implemented

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
file unformatted, exits 0). If needed later, users can set an explicit `formatCmd` command that
includes the `yarn exec` prefix.

## Design

### Config

Add an optional `formatCmd` field to the sammy config (in `package.json`):

```jsonc
"sammy": {
  "formatCmd": "biome format --write {file}"  // optional
}
```

- A **command string** with an optional `{file}` placeholder. Sammy substitutes the appspec filename
  wherever `{file}` appears. If `{file}` is **absent, nothing is appended** — the command runs
  exactly as written (some formatters take no file argument, e.g. `biome format --write .` or a
  wrapper script).
- `SammyConfig` gains `formatCmd?: string` (`packages/sammy/src/types.ts`).

### Resolution order — `resolveFormatCommand(projectDir)`

Returns `{ command: string } | { skip: "none" | "incapable" }`.

1. `config.formatCmd` present → `{ command }` (use it verbatim).
2. else detect by **config file only** in `projectDir` (the dir of the `package.json` that
   `read-pkg-up` resolved) — no dependency-list sniffing, to avoid false positives from transitive
   deps that aren't wired up:
   - prettier config (`.prettierrc*`, `prettier.config.*`) →
     `{ command: "prettier --write {file}" }`
   - else dprint config (`dprint.json` / `dprint.jsonc`) → `{ command: "dprint fmt {file}" }`
   - else biome (`biome.json` / `biome.jsonc`) or oxide config present → `{ skip: "incapable" }`
     (drives the distinct message — the project has a formatter, it just can't do YAML)
3. else → `{ skip: "none" }`.

### Invocation

```ts
const resolved = resolveFormatCommand(projectDir);

if ("skip" in resolved) {
  if (resolved.skip === "incapable") {
    console.info(
      `⚠ Detected a formatter that can't format YAML (biome/oxide). ` +
        `Wrote ${appspecName} unformatted. Set "sammy.formatCmd" in package.json to use prettier/dprint.`
    );
  } else {
    console.info(
      `⚠ No YAML-capable formatter detected (prettier/dprint). ` +
        `Wrote ${appspecName} unformatted. Set "sammy.formatCmd" in package.json to configure one.`
    );
  }
} else {
  const parts = resolved.command.split(/\s+/);
  const args = parts.slice(1).map((a) => (a === "{file}" ? appspecName : a));
  // No auto-append: if the command has no {file}, it runs exactly as written.
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
- The filename is passed **only** via `{file}`; it is never auto-appended, so commands that take no
  file argument work unchanged.
- Formatting runs in its **own** try/catch so a formatter failure never aborts `appspec:get` — the
  YAML is already written and the download succeeded.

### Graceful skip — always exit 0, always log

| Situation                             | Log                                                                                                             |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| No formatter config detected (`none`) | `⚠ No YAML-capable formatter detected (prettier/dprint). Wrote <file> unformatted. Set "sammy.formatCmd"…`      |
| biome/oxide detected (`incapable`)    | `⚠ Detected a formatter that can't format YAML (biome/oxide). Wrote <file> unformatted. Set "sammy.formatCmd"…` |
| Formatter resolved but errored        | `⚠ Formatter "<cmd>" failed: <msg>. Wrote <file> unformatted.`                                                  |

## Testing

- Unit: `resolveFormatCommand` returns explicit config, detected prettier, detected dprint,
  `{ skip: "incapable" }` for a biome/oxide project, and `{ skip: "none" }` in a bare dir.
- Unit: `{file}` substitution, and that a command without `{file}` runs unchanged (no append).
- Integration: `appspec:get` in a monorepo-style fixture (nested package, bin at a parent
  `node_modules/.bin`) resolves via `preferLocal`.
- Integration: formatter-failure and no-formatter paths both exit 0 and log.

## Resolved decisions

- **No auto-append of the filename** — the appspec name is injected only where `{file}` appears, so
  file-less commands work.
- **Config-file-only detection** — no dependency-list sniffing.
- **Distinct `incapable` skip message** — biome/oxide projects get a message pointing them at
  prettier/dprint, separate from the "nothing detected" case.

## Open questions

- Which oxide config file(s) to detect for the `incapable` message (`oxlintrc.json`? `.oxlintrc`?
  oxc's formatter config is still stabilizing) — confirm before implementing, or drop oxide from
  detection and let it fall into the generic `none` message.
