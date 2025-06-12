const { generateWebpackConfig, merge } = require("shakapacker")
const webpackConfig = generateWebpackConfig()
const webpack = require("webpack")
require("./dotenv")

webpackConfig.plugins.push(new webpack.EnvironmentPlugin(process.env))

module.exports = merge({}, webpackConfig)
