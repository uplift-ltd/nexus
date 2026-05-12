"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameCjsExtensions = renameCjsExtensions;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
// Longest extensions first so ".d.ts" and ".js.map" match before ".js"
const REPLACEMENTS = [
    [".d.ts", ".d.cts", /(?:from|import\()"(\.[^"]*?)\.js"/g],
    [".js.map", ".cjs.map", null],
    [".js", ".cjs", /require\("(\.[^"]*?)\.js"\)/g],
];
const SOURCE_MAP_URL_REGEX = /(\/\/# sourceMappingURL=.*?)\.js\.map(\s*$)/gm;
const CLI_BASENAME_REGEX = /^renameCjsExtensions\.(?:ts|js|cjs|mjs)$/;
async function renameCjsExtensions(dir) {
    const entries = await promises_1.default.readdir(dir, { withFileTypes: true });
    await Promise.all(entries.map(async (entry) => {
        const fullPath = path_1.default.join(dir, entry.name);
        if (entry.isDirectory()) {
            return renameCjsExtensions(fullPath);
        }
        const match = REPLACEMENTS.find(([ext]) => entry.name.endsWith(ext));
        if (!match)
            return;
        const [oldExt, newExt, rewrite] = match;
        const newPath = fullPath.slice(0, -oldExt.length) + newExt;
        if (rewrite) {
            const content = await promises_1.default.readFile(fullPath, "utf8");
            await promises_1.default.writeFile(newPath, content
                .replace(rewrite, (m) => m.replace(".js", ".cjs"))
                .replace(SOURCE_MAP_URL_REGEX, "$1.cjs.map$2"));
            await promises_1.default.unlink(fullPath);
        }
        else {
            await promises_1.default.rename(fullPath, newPath);
        }
    }));
}
// CLI entry point
if (process.argv[1] && CLI_BASENAME_REGEX.test(path_1.default.basename(process.argv[1]))) {
    const dir = process.argv[2] || "./cjs";
    renameCjsExtensions(dir).then(() => console.info("Renamed CJS extensions in", dir));
}
