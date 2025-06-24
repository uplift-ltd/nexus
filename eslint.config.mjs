import js from "@eslint/js";
import { includeIgnoreFile } from "@eslint/compat";
import globals from "globals";
import { fileURLToPath } from "node:url";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import importExtensions from "eslint-plugin-import-extensions";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import perfectionist from "eslint-plugin-perfectionist";
import jsxA11y from "eslint-plugin-jsx-a11y";
import eslintConfigPrettier from "eslint-config-prettier/flat";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default defineConfig([
  includeIgnoreFile(gitignorePath, "Imported .gitignore patterns"),
  globalIgnores(
    [
      "packages/*/cjs",
      "packages/*/esm",
      "packages/*/dest",
      "packages/create-nexus-package/fixtures/",
    ],
    "Ignore build files"
  ),
  { extends: ["js/recommended"], files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], plugins: { js } },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
          varsIgnorePattern: "(^_|React)",
        },
      ],
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { "import-extensions": importExtensions },
    rules: {
      "import-extensions/require-extensions": "error",
      "import-extensions/require-index": "error",
    },
  },
  {
    files: ["**/*.{cjs,cts}"],
    languageOptions: {
      sourceType: "commonjs",
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  reactHooks.configs["recommended-latest"],
  jsxA11y.flatConfigs.recommended,
  {
    plugins: {
      perfectionist,
    },
    rules: {
      "perfectionist/sort-interfaces": ["error"],
      "perfectionist/sort-objects": ["error"],
    },
    settings: {
      perfectionist: {
        partitionByComment: true,
        type: "natural",
      },
    },
  },
  eslintConfigPrettier,
]);
