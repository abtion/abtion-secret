import mountComponents from "../utils/mountComponents"

const pagesContext = require.context("../pages", true)

mountComponents(pagesContext)
