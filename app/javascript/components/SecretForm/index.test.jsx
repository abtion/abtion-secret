import { fireEvent, render, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import SecretForm from "."

jest.mock(
  "../../utils/encryptSecret",
  () => () => Promise.resolve(Buffer.from("")),
)

beforeEach(() => {
  window.fetch = jest.fn() // jest has no fetch implementation
  window.fetch.mockResolvedValue({
    json: () => Promise.resolve("key"),
  })
})

afterEach(() => {
  window.fetch = undefined
})

describe(SecretForm, () => {
  it("encrypts and stored secrets", async () => {
    const onSecretStored = jest.fn()

    const { getByPlaceholderText, getByText } = render(
      <SecretForm onSecretStored={onSecretStored} secret="" />,
    )

    await userEvent.type(
      getByPlaceholderText("Write your secret here..."),
      "The secret",
    )

    userEvent.click(getByText("Create link"))

    await waitFor(() => {
      expect(window.fetch).toHaveBeenCalledWith(
        "/api/secrets",
        expect.objectContaining({
          body: expect.any(FormData),
        }),
      )
    })

    expect(onSecretStored).toHaveBeenCalledWith({
      secret: "The secret",
      keyPass: expect.any(String),
    })
  })

  it("sends the chosen lifetime in the request body", async () => {
    const onSecretStored = jest.fn()

    const { getByPlaceholderText, getByText, getByLabelText } = render(
      <SecretForm onSecretStored={onSecretStored} secret="" />,
    )

    await userEvent.type(
      getByPlaceholderText("Write your secret here..."),
      "The secret",
    )

    await userEvent.selectOptions(getByLabelText("Link lifetime"), "7")

    userEvent.click(getByText("Create link"))

    await waitFor(() => {
      expect(window.fetch).toHaveBeenCalled()
    })

    const formData = window.fetch.mock.calls[0][1].body
    expect(formData.get("lifetime_days")).toBe("7")
  })

  it("defaults the lifetime to 1 day", async () => {
    const onSecretStored = jest.fn()

    const { getByPlaceholderText, getByText } = render(
      <SecretForm onSecretStored={onSecretStored} secret="" />,
    )

    await userEvent.type(
      getByPlaceholderText("Write your secret here..."),
      "The secret",
    )

    userEvent.click(getByText("Create link"))

    await waitFor(() => {
      expect(window.fetch).toHaveBeenCalled()
    })

    const formData = window.fetch.mock.calls[0][1].body
    expect(formData.get("lifetime_days")).toBe("1")
  })

  describe("when secret is too long", () => {
    it("disables the secret button", async () => {
      const { getByPlaceholderText, getByText } = render(
        <SecretForm secret="" />,
      )

      const maxSecretChars = parseInt(process.env.MAX_SECRET_CHARS)
      const tooLongString = new Array(maxSecretChars + 1).fill("a").join("")

      const input = getByPlaceholderText("Write your secret here...")

      // `userEvent.type` makes an event for each char,
      // causing the maximum call stack size to be exceeded
      fireEvent.change(input, { target: { value: tooLongString } })

      const submitButton = getByText(
        `Secret is too long (${maxSecretChars + 1} / ${maxSecretChars})`,
      )

      expect(submitButton).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
    })
  })
})
