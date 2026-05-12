#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const execa_1 = require("execa");
const renameCjsExtensions_js_1 = require("./renameCjsExtensions.cjs");
const replaceProgramVersion_js_1 = require("./replaceProgramVersion.cjs");
const program = new commander_1.Command();
program.version("4.1.2");
program
    .command("build-library")
    .option("--tsconfig <path>", "Path to tsconfig.json", "tsconfig.json")
    .action(async (script, _options) => {
    try {
        const cjs = await (0, execa_1.execa)("tsc", [
            "-p",
            script.tsconfig,
            "--outDir",
            "./cjs",
            "--module",
            "commonjs",
        ]);
        if (cjs.all) {
            console.info(cjs.all);
        }
        const esm = await (0, execa_1.execa)("tsc", [
            "-p",
            script.tsconfig,
            "--outDir",
            "./esm",
            "--module",
            "es2020",
        ]);
        if (esm.all) {
            console.info(esm.all);
        }
        await (0, renameCjsExtensions_js_1.renameCjsExtensions)("./cjs");
        if (!cjs.all && !esm.all) {
            console.info("Nexus build-library done!");
        }
    }
    catch (err) {
        console.error(err);
        process.exitCode = 1;
    }
});
program.command("clean-library").action(async (_script, _options) => {
    try {
        const clean = await (0, execa_1.execa)("git", ["clean", "-dfx", "cjs", "esm"]);
        if (clean.all) {
            console.info(clean.all);
        }
        else {
            console.info("Nexus clean-library done!");
        }
    }
    catch (err) {
        console.error(err);
        process.exitCode = 1;
    }
});
program.command("replace-program-version").action(async (_script, _options) => {
    try {
        const result = await (0, replaceProgramVersion_js_1.replaceProgramVersion)();
        if (result.length) {
            console.info(result
                .filter(({ hasChanged }) => hasChanged)
                .map(({ file }) => file)
                .join("\n"));
        }
        else {
            console.info("Nothing to replace.");
        }
    }
    catch (err) {
        console.error(err);
        process.exitCode = 1;
    }
});
program.parse(process.argv);
exports.default = program;
