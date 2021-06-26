module.exports = {
  roots: ["frontend"],
  testRegex: ".*test.jsx?$",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ['./frontend/jest.setup.js'],
}
