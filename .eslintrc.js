module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'standard',
    'plugin:react/recommended',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true, // This is the key line - it tells ESLint to expect JSX syntax
    },
  },
  plugins: [
    'react',
  ],
  rules: {
    'comma-dangle': ['error', 'always-multiline'], // Enforces trailing commas for multiline statements
    'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }], // Enforces .jsx extension for JSX files
    'react/react-in-jsx-scope': 'off', // Prevents React to be incorrectly marked as unused
  },
  settings: {
    react: {
      version: 'detect', // Automatically picks the version you have installed.
    },
  },
}
