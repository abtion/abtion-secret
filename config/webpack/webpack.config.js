const { generateWebpackConfig } = require("shakapacker")
const webpackConfig = generateWebpackConfig()
const webpack = require("webpack")
require("./dotenv")

webpackConfig.plugins.push(new webpack.EnvironmentPlugin(process.env))

const nodeSassGlobImporter = require("node-sass-glob-importer")

const sassRule = webpackConfig.module.rules.find((rule) =>
  [].concat(rule.test).some((test) => test.test(".scss"))
)
const sassLoader = sassRule.use.find((use) => {
  const loader = typeof use === "object" ? use.loader : use
  return loader.includes("sass-loader")
})

sassLoader.options.sassOptions.importer = nodeSassGlobImporter()

module.exports = webpackConfig
