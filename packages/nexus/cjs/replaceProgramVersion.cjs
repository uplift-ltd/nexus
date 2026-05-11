"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceProgramVersion = replaceProgramVersion;
const path_1 = __importDefault(require("path"));
const read_pkg_up_1 = require("read-pkg-up");
const replace_in_file_1 = require("replace-in-file");
async function replaceProgramVersion() {
    const pkg = await (0, read_pkg_up_1.readPackageUp)();
    if (!pkg) {
        throw new Error("Could not find package.json");
    }
    const dir = path_1.default.dirname(pkg.path);
    const cjsPath = path_1.default.join(dir, "./cjs/*.cjs");
    const esmPath = path_1.default.join(dir, "./esm/*.js");
    const options = {
        files: [cjsPath, esmPath],
        from: /program\.version\((.+)\)/,
        // format differently so we don't replace in this file (the compiled one)
        to: "program.version" + `(${JSON.stringify(pkg.packageJson.version)})`,
    };
    return (0, replace_in_file_1.replaceInFile)(options);
}
