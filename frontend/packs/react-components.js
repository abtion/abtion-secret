import React from "react"
import ReactDOM from "react-dom"

const componentsContext = require.context("../pages", true)

function getConstructor(className) {
  const parts = className.split(".")
  const filename = parts.shift()
  const keys = parts
  const requirePath = `./${filename}`

  try {
    // Load the module:
    let component = componentsContext(requirePath)

    // Then access each key:
    keys.forEach(function (k) {
      component = component[k]
    })

    // support `export default`
    if (component.__esModule) {
      component = component["default"]
    }
    return component
  } catch (error) {
    console.error(`Invalid component: ${requirePath}`) // eslint-disable-line
    console.log("Valid components are:", componentsContext.keys()) // eslint-disable-line
  }
}

function mountComponent() {
  const nodes = document.querySelectorAll("[data-react-component]")

  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i]
    const className = node.getAttribute("data-react-component")
    const constructor = getConstructor(className)

    if (!constructor) continue

    const propsJson = node.getAttribute("data-react-props")
    const props = propsJson && JSON.parse(propsJson)

    const component = React.createElement(constructor, props)
    ReactDOM.render(component, node)
  }
}

mountComponent()
