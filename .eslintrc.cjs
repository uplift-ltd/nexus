const path = require("path");

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: path.resolve(__dirname, "tsconfig.json"),
  },
  env: {
    browser: true,
    jest: true,
  },
  plugins: ["@typescript-eslint", "import", "require-extensions"],
  extends: [
    "airbnb",
    "react-app",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
    "plugin:require-extensions/recommended",
  ],
  rules: {
    "no-console": ["error", { allow: ["info", "warn", "error"] }],
    "no-underscore-dangle": ["error", { allow: ["__typename"] }],
    "class-methods-use-this": 0,
    "react/jsx-filename-extension": 0,
    "react/jsx-one-expression-per-line": 0,
    "react/jsx-props-no-spreading": 0,
    "react/jsx-wrap-multilines": 0,
    "react/prefer-stateless-function": 0,
    "import/order": [
      "error",
      {
        alphabetize: { order: "asc" },
        groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
        pathGroups: [
          {
            // CSS should be loaded last so that it can override components in common folder
            pattern: "./*.module.css",
            group: "sibling",
            position: "after",
          },
        ],
        "newlines-between": "never",
      },
    ],
    "import/prefer-default-export": 0,
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "import/extensions": 0,
    "jsx-a11y/label-has-for": 0,
    "jsx-a11y/label-has-associated-control": [
      "error",
      {
        assert: "either",
      },
    ],
    // override eslint rules with typescript-eslint rules
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-redeclare.md
    "no-redeclare": "off",
    "@typescript-eslint/no-redeclare": ["error"],

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-empty-function.md
    "no-empty-function": "off",
    "@typescript-eslint/no-empty-function": ["error"],

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"],

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": "error",

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-duplicate-imports.md
    "no-duplicate-imports": "off",
    "@typescript-eslint/no-duplicate-imports": "error",

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-expressions.md
    "no-unused-expressions": "off",
    "@typescript-eslint/no-unused-expressions": ["error"],

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-vars.md
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-implied-eval.md
    "no-implied-eval": "off",
    "@typescript-eslint/no-implied-eval": ["error"],

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/return-await.md
    "return-await": "off",
    "@typescript-eslint/return-await": ["error"],

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-invalid-this.md
    "no-invalid-this": "off",
    "@typescript-eslint/no-invalid-this": ["error"],

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/init-declarations.md
    "init-declarations": "off",
    "@typescript-eslint/init-declarations": "off",

    camelcase: 0,
    "@typescript-eslint/camelcase": 0,

    "@typescript-eslint/indent": 0,
    "@typescript-eslint/member-delimiter-style": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/explicit-member-accessibility": ["error", { accessibility: "no-public" }],
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/no-unused-vars": ["error"],
    "@typescript-eslint/ban-ts-comment": [
      "error",
      {
        "ts-expect-error": false,
        "ts-ignore": true,
        "ts-nocheck": true,
        "ts-check": false,
      },
    ],
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "react/prop-types": 0,
        "react/require-default-props": 0,
      },
    },
    {
      files: ["*.test.ts", "*.test.tsx"],
      rules: {
        "@typescript-eslint/no-explicit-any": 0,
      },
    },
  ],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        project: [path.resolve(__dirname, "tsconfig.json")],
      },
    },
  },
};
