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
    // 'no-console': 'off', // Warns about console.log statements
    // 'react/prop-types': 'off', // Turns off prop-types rule for React
    'comma-dangle': ['error', 'always-multiline'], // Enforces trailing commas for multiline statements
    // 'prefer-const': 'error', // Requires that developers use const for variables that are never reassigned after declared
    // 'react/jsx-uses-react': 'error', // Prevents React to be incorrectly marked as unused
    // 'react/jsx-uses-vars': 'error', // Prevents variables used in JSX to be incorrectly marked as unused
    // 'react-hooks/rules-of-hooks': 'off', // Checks rules of Hooks
    // 'react-hooks/exhaustive-deps': 'off', // Checks effect dependencies
    // 'no-mixed-operators': 'off', // Allows mixed operators
    // 'no-void': 'off', // Allows void operator
    // 'no-return-assign': 'off', // Allows return statements to be used in the value position of assignments
    // 'no-unused-expressions': 'off', // Allows unused expressions
    // 'no-sequences': 'off', // Allows comma operator
    // 'no-var': 'off', // Requires that var is not used
    'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }], // Enforces .jsx extension for JSX files
    'react/react-in-jsx-scope': 'off', // Prevents React to be incorrectly marked as unused
  },
  settings: {
    react: {
      version: 'detect', // Automatically picks the version you have installed.
    },
  },
}
