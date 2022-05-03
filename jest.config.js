module.exports = {
  roots: ["app/javascript"],
  testRegex: ".*test.jsx?$",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./app/javascript/jest.setup.js"],
  moduleFileExtensions: ["js", "json", "jsx", "scss"],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },
}
