module.exports = {
  roots: ["frontend"],
  testRegex: ".*test.jsx?$",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ['./frontend/jest.setup.js'],
  moduleFileExtensions: ["js", "json", "jsx", "scss"],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },
}
