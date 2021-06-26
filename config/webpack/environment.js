const { environment } = require("@rails/webpacker")
const webpack = require("webpack")
require("./dotenv")

environment.plugins.insert(
  "Environment",
  new webpack.EnvironmentPlugin(process.env)
)

module.exports = environment
