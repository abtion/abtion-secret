import { render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import InlineSelect from "."

const options = [
  { value: 1, label: "One" },
  { value: 2, label: "Two" },
  { value: 3, label: "Three" },
]

describe(InlineSelect, () => {
  it("renders the selected option's label as visible text", () => {
    const { getByText } = render(
      <InlineSelect
        aria-label="Number"
        value={2}
        onChange={() => {}}
        options={options}
      />,
    )

    expect(getByText("Two", { ignore: "option" })).toBeInTheDocument()
  })

  it("renders an option element for every entry", () => {
    const { getAllByRole } = render(
      <InlineSelect
        aria-label="Number"
        value={1}
        onChange={() => {}}
        options={options}
      />,
    )

    expect(getAllByRole("option")).toHaveLength(3)
  })

  it("calls onChange when a different option is picked", async () => {
    let pickedValue
    const handleChange = jest.fn((event) => {
      pickedValue = event.target.value
    })

    const { getByLabelText } = render(
      <InlineSelect
        aria-label="Number"
        value={1}
        onChange={handleChange}
        options={options}
      />,
    )

    await userEvent.selectOptions(getByLabelText("Number"), "3")

    expect(handleChange).toHaveBeenCalled()
    expect(pickedValue).toBe("3")
  })
})
