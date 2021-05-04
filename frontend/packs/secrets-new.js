// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
import * as openpgp from "openpgp"

const form = document.querySelector("form")

const generatePassword = () => {
  const length = 32
  const hex = "0123456789abcdef"
  let output = ""
  for (let i = 0; i < length; ++i) {
    output += hex.charAt(Math.floor(Math.random() * hex.length))
  }
  return output
}

const encryptSecret = async (secret, password) => {
  const message = await openpgp.createMessage({ text: secret })

  const binary = await openpgp.encrypt({
    message,
    passwords: [password],
    armor: false,
  })

  return new Blob([binary])
}

const handleFormSubmit = async (event) => {
  event.preventDefault()

  const secret = form.querySelector('[name="secret"]').value
  const csrfToken = document.querySelector("[name=csrf-token]").content

  const password = generatePassword()
  const secretBlob = await encryptSecret(secret, password)

  console.log(secretBlob)

  const formData = new FormData()
  formData.append("secret", secretBlob)

  const response = await fetch("/api/secrets", {
    method: "POST",
    headers: {
      "X-Api-Version": "v1",
      "X-CSRF-Token": csrfToken,
      // "Content-Type": "multipart",
    },
    body: formData,
  })

  const key = await response.json()

  const urlElement = document.querySelector(".link__url")
  urlElement.value = `${location.host}/${key}#${password}`

  const linkElement = document.querySelector(".link")
  linkElement.classList.toggle("link--hidden", false)
}

form.addEventListener("submit", handleFormSubmit)
