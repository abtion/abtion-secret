// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
import * as openpgp from "openpgp"

const decrypt = async () => {
  const textarea = document.querySelector("textarea")
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

decrypt()
