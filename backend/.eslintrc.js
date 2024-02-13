module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,ejs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true, // This is the key line - it tells ESLint to expect JSX syntax
    },
    requireConfigFile: false,
  },
  rules: {
    "comma-dangle": ["error", "always-multiline"],
    quotes: ["error", "double"],
    "no-undef" : "off",
  },
  settings: {
    react: {
      version: "detect", // Automatically picks the version you have installed.
    },
  },
}
