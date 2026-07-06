import { mkdtempSync, mkdirSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import path from "path";

import { buildFormatArgv, formatSkipMessage, resolveFormatCommand } from "../src/formatter.js";

// Build a repo-like fixture rooted at a `.git` marker so detection stops there
// instead of walking into the real filesystem.
function makeRepo(): string {
  const repo = mkdtempSync(path.join(tmpdir(), "sammy-fmt-"));
  writeFileSync(path.join(repo, ".git"), "");
  return repo;
}

function touch(dir: string, name: string, contents = ""): void {
  writeFileSync(path.join(dir, name), contents);
}

describe("resolveFormatCommand", () => {
  it("uses explicit config verbatim, skipping detection", () => {
    const repo = makeRepo();
    touch(repo, "biome.json"); // would otherwise be `incapable`
    expect(resolveFormatCommand(repo, "dprint fmt {file}")).toEqual({
      command: "dprint fmt {file}",
    });
  });

  it("detects prettier via config file", () => {
    const repo = makeRepo();
    touch(repo, ".prettierrc");
    expect(resolveFormatCommand(repo)).toEqual({ command: "prettier --write {file}" });
  });

  it("detects prettier via the package.json key", () => {
    const repo = makeRepo();
    touch(repo, "package.json", JSON.stringify({ prettier: { printWidth: 100 } }));
    expect(resolveFormatCommand(repo)).toEqual({ command: "prettier --write {file}" });
  });

  it("detects dprint", () => {
    const repo = makeRepo();
    touch(repo, "dprint.jsonc");
    expect(resolveFormatCommand(repo)).toEqual({ command: "dprint fmt {file}" });
  });

  it("finds a monorepo-root config from a nested package dir", () => {
    const repo = makeRepo();
    touch(repo, ".prettierrc");
    const pkgDir = path.join(repo, "packages", "app");
    mkdirSync(pkgDir, { recursive: true });
    expect(resolveFormatCommand(pkgDir)).toEqual({ command: "prettier --write {file}" });
  });

  it("prefers a capable formatter over an incapable one lower down", () => {
    const repo = makeRepo();
    touch(repo, ".prettierrc");
    const pkgDir = path.join(repo, "packages", "app");
    mkdirSync(pkgDir, { recursive: true });
    touch(pkgDir, "biome.json");
    expect(resolveFormatCommand(pkgDir)).toEqual({ command: "prettier --write {file}" });
  });

  it("reports `incapable` when only biome is present", () => {
    const repo = makeRepo();
    touch(repo, "biome.json");
    expect(resolveFormatCommand(repo)).toEqual({ skip: "incapable" });
  });

  it("reports `none` in a bare repo", () => {
    const repo = makeRepo();
    expect(resolveFormatCommand(repo)).toEqual({ skip: "none" });
  });
});

describe("buildFormatArgv", () => {
  it("substitutes {file} in place", () => {
    expect(buildFormatArgv("prettier --write {file}", "appspec.prod.yml")).toEqual([
      "prettier",
      ["--write", "appspec.prod.yml"],
    ]);
  });

  it("leaves a command without {file} unchanged (no append)", () => {
    expect(buildFormatArgv("biome format --write .", "appspec.prod.yml")).toEqual([
      "biome",
      ["format", "--write", "."],
    ]);
  });
});

describe("formatSkipMessage", () => {
  it("distinguishes incapable from none", () => {
    expect(formatSkipMessage("incapable", "appspec.prod.yml")).toContain("biome");
    expect(formatSkipMessage("none", "appspec.prod.yml")).toContain("No YAML-capable formatter");
  });
});
