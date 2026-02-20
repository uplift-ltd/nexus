import fs from "fs";
import path from "path";

export function renameCjsExtensions(dir: string): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      renameCjsExtensions(fullPath);
    } else if (entry.name.endsWith(".d.ts")) {
      let content = fs.readFileSync(fullPath, "utf8");
      content = content.replace(/from "(\.[^"]*?)\.js"/g, 'from "$1.cjs"');
      content = content.replace(/import\("(\.[^"]*?)\.js"\)/g, 'import("$1.cjs")');
      const newPath = fullPath.slice(0, -5) + ".d.cts";
      fs.writeFileSync(newPath, content);
      fs.unlinkSync(fullPath);
    } else if (entry.name.endsWith(".js.map")) {
      const newPath = fullPath.slice(0, -7) + ".cjs.map";
      fs.renameSync(fullPath, newPath);
    } else if (entry.name.endsWith(".js")) {
      let content = fs.readFileSync(fullPath, "utf8");
      content = content.replace(/require\("(\.[^"]*?)\.js"\)/g, 'require("$1.cjs")');
      const newPath = fullPath.slice(0, -3) + ".cjs";
      fs.writeFileSync(newPath, content);
      fs.unlinkSync(fullPath);
    }
  }
}

// CLI entry point
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const dir = process.argv[2] || "./cjs";
  renameCjsExtensions(dir);
  console.info("Renamed CJS extensions in", dir);
}
