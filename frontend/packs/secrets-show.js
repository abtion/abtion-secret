// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
import * as openpgp from "openpgp"
import autoresize from "../utils/autosize"

const textarea = document.querySelector("textarea")
const copyButton = document.querySelector(".secret__copy")
const backLink = document.querySelector(".secret__back-link")

const decrypt = async () => {
  const key = textarea.getAttribute("data-key")
  const password = location.hash.substr(1)

  const response = await fetch(`/api/secrets/${key}`, {
    method: "GET",
    headers: { "X-Api-Version": "v1" },
  })

  const encryptedSecret = await response.blob()

  const binaryMessage = new Uint8Array(await encryptedSecret.arrayBuffer())

  const result = await openpgp.decrypt({
    message: await openpgp.readMessage({ binaryMessage }),
    passwords: [password],
  })

  textarea.value = result.data
}

const init = async () => {
  try {
    await decrypt()
    document.body.classList.add("secrets-show--success")

    copyButton.addEventListener("click", () => {
      navigator.clipboard.writeText(textarea.value)
    })

    backLink.addEventListener("click", (event) => {
      const shouldNavigate = confirm(
        "If you haven't copied your secret yet, you will loose it.\n\nContinue?"
      )

      if (!shouldNavigate) event.preventDefault()
    })

    autoresize(textarea)
  } catch (_error) {
    document.body.classList.add("secrets-show--failure")
  }
}

init()
