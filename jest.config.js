module.exports = {
  roots: ["app/javascript"],
  testRegex: ".*test.jsx?$",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest", require("./config/swc.config.js").options],
  },
  setupFilesAfterEnv: ["./app/javascript/jest.setup.js"],
  moduleFileExtensions: ["js", "json", "jsx", "scss"],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },
}
