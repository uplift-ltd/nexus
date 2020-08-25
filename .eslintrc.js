module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
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
    "react/jsx-wrap-multilines": 0,
    "react/prefer-stateless-function": 0,
    "import/order": "error",
    "import/prefer-default-export": 0,
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "jsx-a11y/label-has-for": "off",
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
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "react/prop-types": 0,
      },
    },
  ],
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
};
