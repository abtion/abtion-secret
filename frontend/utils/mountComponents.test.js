import React from "react"
import mountComponents from "./mountComponents"

const buildContextMock = (componentsByPath) => {
  const context = (path) => {
    const component = componentsByPath[path]

    if (!component) throw new Error(`Cannot find module '${path}'`)

    return component
  }

  context.keys = () => Object.keys(componentsByPath)

  return context
}

function TestComponent({ title }) {
  return <h1 className="TestComponent">{title}</h1>
}

describe(mountComponents, () => {
  afterEach(() => {
    document.body.innerHTML = ""
  })

  it("mounts default exports", () => {
    const element = document.createElement("div")
    element.setAttribute("data-react-component", "TestComponent")
    element.setAttribute("data-react-props", '{"title":"Title"}')
    document.body.appendChild(element)

    const context = buildContextMock({
      "./TestComponent": { __esModule: true, default: TestComponent },
    })

    mountComponents(context)

    expect(document.body.querySelector(".TestComponent").tagName).toBe("H1")
    expect(document.body.querySelector(".TestComponent").textContent).toBe(
      "Title"
    )
  })

  it("mounts named exports", () => {
    const element = document.createElement("div")
    element.setAttribute("data-react-component", "List.TestComponent")
    element.setAttribute("data-react-props", '{"title":"Title"}')
    document.body.appendChild(element)

    const context = buildContextMock({
      "./List": { TestComponent },
    })

    mountComponents(context)

    expect(document.body.querySelector(".TestComponent").tagName).toBe("H1")
    expect(document.body.querySelector(".TestComponent").textContent).toBe(
      "Title"
    )
  })

  it("searches multiple contexts", () => {
    const element = document.createElement("div")
    element.setAttribute("data-react-component", "List.TestComponent")
    element.setAttribute("data-react-props", '{"title":"Title"}')
    document.body.appendChild(element)

    const contextA = buildContextMock({})
    const contextB = buildContextMock({
      "./List": { TestComponent },
    })

    mountComponents(contextA, contextB)

    expect(document.body.querySelector(".TestComponent").tagName).toBe("H1")
  })

  describe("when component name is invalid", () => {
    /* eslint-disable no-console */
    const originalConsoleLog = console.log
    const originalConsoleError = console.error

    beforeEach(() => {
      console.log = jest.fn()
      console.error = jest.fn()
    })

    afterEach(() => {
      console.log = originalConsoleLog
      console.error = originalConsoleError
    })

    it("prints useful error messages", () => {
      const element = document.createElement("div")
      element.setAttribute("data-react-component", "TestComponent")
      element.setAttribute("data-react-props", '{"title":"Title"}')
      document.body.appendChild(element)

      const contextA = buildContextMock({
        "./Component1": {},
      })
      const contextB = buildContextMock({
        "./Component2": {},
        "./Component3": {},
      })

      mountComponents(contextA, contextB)

      expect(console.error).toHaveBeenCalledWith(
        "Could not load component: ./TestComponent"
      )
      expect(console.log).toHaveBeenCalledWith("Valid paths are:", [
        "./Component1",
        "./Component2",
        "./Component3",
      ])
    })

    /* eslint-enable no-console */
  })
})
