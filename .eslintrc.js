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
  plugins: ["@typescript-eslint", "import"],
  extends: [
    "airbnb",
    "react-app",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
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
