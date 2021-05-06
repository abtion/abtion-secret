// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
import * as openpgp from "openpgp"
import autoresize from "../utils/autosize"

const form = document.querySelector("form")
const secretInput = form.querySelector(".secret__input")
const linkModal = document.querySelector(".link-modal")
const urlInput = linkModal.querySelector(".link-modal__url")
const copyButton = document.querySelector(".link-modal__copy")
const passwordLength = parseInt(process.env.PASSWORD_LENGTH)

autoresize(secretInput, 300)

const generatePassword = () => {
  const hex = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
  let output = ""
  for (let i = 0; i < passwordLength; ++i) {
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

  const secret = secretInput.value
  const csrfToken = document.querySelector("[name=csrf-token]").content

  const password = generatePassword()
  const secretBlob = await encryptSecret(secret, password)

  const formData = new FormData()
  formData.append("secret", secretBlob)

  const response = await fetch("/api/secrets", {
    method: "POST",
    headers: {
      "X-Api-Version": "v1",
      "X-CSRF-Token": csrfToken,
    },
    body: formData,
  })

  const key = await response.json()
  showUrl(`${location.origin}/${key}#${password}`)
}

const showUrl = (url) => {
  document.body.classList.add("modal-shown")

  urlInput.value = url
  linkModal.classList.toggle("link-modal--hidden", false)
}

form.addEventListener("submit", handleFormSubmit)
copyButton.addEventListener("click", () => {
  navigator.clipboard.writeText(urlInput.value)
})
