#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Command } from "commander";
// On CI only, we get this: Error: @uplift-ltd/nexus: src/nexus.ts(4,19): error TS7016: Could not find a declaration file for module 'execa'. '/home/runner/work/nexus/nexus/node_modules/execa/index.js' implicitly has an 'any' type.
// Seems like TypeScript is looking at the root node_modules/execa instead of the one here.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import execa from "execa";
import { replaceProgramVersion } from "./replaceProgramVersion.js";
var program = new Command();
program.version("4.0.0");
program
    .command("build-library")
    .option("--tsconfig <path>", "Path to tsconfig.json", "tsconfig.json")
    .action(function (script, _options) { return __awaiter(void 0, void 0, void 0, function () {
    var cjs, esm, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, execa("tsc", [
                        "-p",
                        script.tsconfig,
                        "--outDir",
                        "./cjs",
                        "--module",
                        "commonjs",
                    ])];
            case 1:
                cjs = _a.sent();
                if (cjs.all) {
                    console.info(cjs.all);
                }
                return [4 /*yield*/, execa("tsc", [
                        "-p",
                        script.tsconfig,
                        "--outDir",
                        "./esm",
                        "--module",
                        "es2020",
                    ])];
            case 2:
                esm = _a.sent();
                if (esm.all) {
                    console.info(esm.all);
                }
                if (!cjs.all && !esm.all) {
                    console.info("Nexus build-library done!");
                }
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.error(err_1);
                process.exitCode = 1;
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
program.command("clean-library").action(function (_script, _options) { return __awaiter(void 0, void 0, void 0, function () {
    var clean, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, execa("git", ["clean", "-dfx", "cjs", "esm"])];
            case 1:
                clean = _a.sent();
                if (clean.all) {
                    console.info(clean.all);
                }
                else {
                    console.info("Nexus clean-library done!");
                }
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                console.error(err_2);
                process.exitCode = 1;
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
program.command("replace-program-version").action(function (_script, _options) { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, replaceProgramVersion()];
            case 1:
                result = _a.sent();
                if (result.length) {
                    console.info(result
                        .filter(function (_a) {
                        var hasChanged = _a.hasChanged;
                        return hasChanged;
                    })
                        .map(function (_a) {
                        var file = _a.file;
                        return file;
                    })
                        .join("\n"));
                }
                else {
                    console.info("Nothing to replace.");
                }
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                console.error(err_3);
                process.exitCode = 1;
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
program.parse(process.argv);
export default program;
