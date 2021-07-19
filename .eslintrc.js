module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
    jest: true,
  },
  extends: ["eslint:recommended", "prettier"],
  parserOptions: {
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react"],
  rules: {
    // enable additional rules
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double", { avoidEscape: true }],

    // Don't allow console.log
    "no-console": ["error"],

    "react/jsx-uses-vars": "warn",
    "react/jsx-uses-react": "warn",
  },
}
