import fs from "fs";
import path from "path";
export function renameCjsExtensions(dir) {
    var entries = fs.readdirSync(dir, { withFileTypes: true });
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        var fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            renameCjsExtensions(fullPath);
        }
        else if (entry.name.endsWith(".d.ts")) {
            var content = fs.readFileSync(fullPath, "utf8");
            content = content.replace(/from "(\.[^"]*?)\.js"/g, 'from "$1.cjs"');
            content = content.replace(/import\("(\.[^"]*?)\.js"\)/g, 'import("$1.cjs")');
            var newPath = fullPath.slice(0, -5) + ".d.cts";
            fs.writeFileSync(newPath, content);
            fs.unlinkSync(fullPath);
        }
        else if (entry.name.endsWith(".js.map")) {
            var newPath = fullPath.slice(0, -7) + ".cjs.map";
            fs.renameSync(fullPath, newPath);
        }
        else if (entry.name.endsWith(".js")) {
            var content = fs.readFileSync(fullPath, "utf8");
            content = content.replace(/require\("(\.[^"]*?)\.js"\)/g, 'require("$1.cjs")');
            var newPath = fullPath.slice(0, -3) + ".cjs";
            fs.writeFileSync(newPath, content);
            fs.unlinkSync(fullPath);
        }
    }
}
// CLI entry point
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
    var dir = process.argv[2] || "./cjs";
    renameCjsExtensions(dir);
    console.info("Renamed CJS extensions in", dir);
}
