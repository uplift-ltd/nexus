"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameCjsExtensions = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
function renameCjsExtensions(dir) {
    var entries = fs_1.default.readdirSync(dir, { withFileTypes: true });
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        var fullPath = path_1.default.join(dir, entry.name);
        if (entry.isDirectory()) {
            renameCjsExtensions(fullPath);
        }
        else if (entry.name.endsWith(".d.ts")) {
            var content = fs_1.default.readFileSync(fullPath, "utf8");
            content = content.replace(/from "(\.[^"]*?)\.js"/g, 'from "$1.cjs"');
            content = content.replace(/import\("(\.[^"]*?)\.js"\)/g, 'import("$1.cjs")');
            var newPath = fullPath.slice(0, -5) + ".d.cts";
            fs_1.default.writeFileSync(newPath, content);
            fs_1.default.unlinkSync(fullPath);
        }
        else if (entry.name.endsWith(".js.map")) {
            var newPath = fullPath.slice(0, -7) + ".cjs.map";
            fs_1.default.renameSync(fullPath, newPath);
        }
        else if (entry.name.endsWith(".js")) {
            var content = fs_1.default.readFileSync(fullPath, "utf8");
            content = content.replace(/require\("(\.[^"]*?)\.js"\)/g, 'require("$1.cjs")');
            var newPath = fullPath.slice(0, -3) + ".cjs";
            fs_1.default.writeFileSync(newPath, content);
            fs_1.default.unlinkSync(fullPath);
        }
    }
}
exports.renameCjsExtensions = renameCjsExtensions;
// CLI entry point
if (process.argv[1] && path_1.default.resolve(process.argv[1]) === path_1.default.resolve(__filename)) {
    var dir = process.argv[2] || "./cjs";
    renameCjsExtensions(dir);
    console.info("Renamed CJS extensions in", dir);
}
