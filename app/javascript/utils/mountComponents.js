import React from "react"
import { createRoot } from "react-dom/client"

function getValidPaths(contexts) {
  return contexts.reduce((res, context) => res.concat(context.keys()), [])
}

function requireComponent(requirePath, contexts) {
  for (let context of contexts) {
    try {
      // Loading a component will raise an error if it fails
      // but we want to be able to try multiple contexts
      return context(requirePath)
    } catch (_e) {} // eslint-disable-line
  }
}

function getConstructor(className, contexts) {
  const parts = className.split(".")
  const filename = parts.shift()
  const keys = parts
  const requirePath = `./${filename}`

  // Load the module:
  let component = requireComponent(requirePath, contexts)

  if (!component) {
    console.error(`Could not load component: ${requirePath}`) // eslint-disable-line
    console.log("Valid paths are:", getValidPaths(contexts)) // eslint-disable-line
    return
  }

  // Then access each key:
  keys.forEach(function (k) {
    component = component[k]
  })

  // support `export default`
  if (component.__esModule) {
    component = component["default"]
  }
  return component
}

export default function mountComponents(...contexts) {
  const nodes = document.querySelectorAll("[data-react-component]")

  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i]
    const className = node.getAttribute("data-react-component")
    const constructor = getConstructor(className, contexts)

    if (!constructor) continue

    const propsJson = node.getAttribute("data-react-props")
    const props = propsJson && JSON.parse(propsJson)

    const component = React.createElement(constructor, props)
    const root = createRoot(node)
    root.render(component)
  }
}
