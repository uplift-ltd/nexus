import fs from "fs/promises";
import path from "path";

// Longest extensions first so ".d.ts" and ".js.map" match before ".js"
const REPLACEMENTS: [string, string, RegExp | null][] = [
  [".d.ts", ".d.cts", /(?:from|import\()"(\.[^"]*?)\.js"/g],
  [".js.map", ".cjs.map", null],
  [".js", ".cjs", /require\("(\.[^"]*?)\.js"\)/g],
];

const SOURCE_MAP_URL_REGEX = /(\/\/# sourceMappingURL=.*?)\.js\.map(\s*$)/gm;
const CLI_BASENAME_REGEX = /^renameCjsExtensions\.(?:ts|js|cjs|mjs)$/;

export async function renameCjsExtensions(dir: string): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return renameCjsExtensions(fullPath);
      }

      const match = REPLACEMENTS.find(([ext]) => entry.name.endsWith(ext));
      if (!match) return;

      const [oldExt, newExt, rewrite] = match;
      const newPath = fullPath.slice(0, -oldExt.length) + newExt;

      if (rewrite) {
        const content = await fs.readFile(fullPath, "utf8");
        await fs.writeFile(
          newPath,
          content
            .replace(rewrite, (m) => m.replace(".js", ".cjs"))
            .replace(SOURCE_MAP_URL_REGEX, "$1.cjs.map$2")
        );
        await fs.unlink(fullPath);
      } else {
        await fs.rename(fullPath, newPath);
      }
    })
  );
}

// CLI entry point
if (process.argv[1] && CLI_BASENAME_REGEX.test(path.basename(process.argv[1]))) {
  const dir = process.argv[2] || "./cjs";
  renameCjsExtensions(dir).then(() => console.info("Renamed CJS extensions in", dir));
}
