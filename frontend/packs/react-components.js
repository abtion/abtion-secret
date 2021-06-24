import mountComponents from "../utils/mountComponents"

const pagesContext = require.context(
  "../pages",
  true,
  /(?<![/.]test(\.jsx?)?)$/
)

mountComponents(pagesContext)
