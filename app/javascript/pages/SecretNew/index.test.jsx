import React from "react"
import { act, render } from "@testing-library/react"

import SecretNew from "."

import SecretForm from "../../components/SecretForm"
import SecretReceipt from "../../components/SecretReceipt"

import getPropsFromMock from "../../utils/getPropsFromMock"

jest.mock("../../components/SecretForm", () => jest.fn())
jest.mock("../../components/SecretReceipt", () => jest.fn())

beforeEach(() => {
  SecretForm.mockImplementation(() => <div data-testid="SecretForm"></div>)
  SecretReceipt.mockImplementation(() => (
    <div data-testid="SecretReceipt"></div>
  ))
})

describe(SecretNew, () => {
  it("initially renders a form", () => {
    const { queryByTestId } = render(<SecretNew />)

    expect(queryByTestId("SecretForm")).toBeInTheDocument()
    expect(queryByTestId("SecretReceipt")).not.toBeInTheDocument()

    expect(SecretForm).toHaveBeenCalledWith(
      {
        secret: "",
        onSecretStored: expect.any(Function),
      },
      expect.anything(),
    )
  })

  describe("when the secret has been stored", () => {
    it("renders a receipt", () => {
      const { queryByTestId } = render(<SecretNew />)

      act(() => {
        const { onSecretStored } = getPropsFromMock(SecretForm)
        onSecretStored({ keyPass: "1234#1234" })
      })

      expect(queryByTestId("SecretReceipt")).toBeInTheDocument()
      expect(SecretReceipt).toHaveBeenCalledWith(
        {
          keyPass: "1234#1234",
          onBackClick: expect.any(Function),
        },
        expect.anything(),
      )
    })
  })

  describe("when navigating back from receipt", () => {
    it("remembers the secret", () => {
      const { queryByTestId } = render(<SecretNew />)

      act(() => {
        const { onSecretStored } = getPropsFromMock(SecretForm)
        onSecretStored({ secret: "secret-value", keyPass: "" })
      })

      expect(queryByTestId("SecretReceipt")).toBeInTheDocument()

      act(() => {
        const { onBackClick } = getPropsFromMock(SecretReceipt)
        onBackClick()
      })

      expect(queryByTestId("SecretReceipt")).not.toBeInTheDocument()

      const { secret } = getPropsFromMock(SecretForm)

      expect(secret).toBe("secret-value")
    })
  })
})
