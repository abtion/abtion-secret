import mountComponents from "../utils/mountComponents"

require.context("../images", true)

require("../stylesheets/application.scss")

const pagesContext = require.context(
  "../pages",
  true,
  /(?<![/.]test(\.jsx?)?)$/
)

mountComponents(pagesContext)
