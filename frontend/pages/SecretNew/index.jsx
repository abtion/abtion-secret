import React, { useState } from "react"

import SecretInput from "../../components/SecretInput"
import SecretLink from "../../components/SecretLink"
import generatePassword from "../../utils/generatePassword"
import encryptSecret from "../../utils/encryptSecret"
import Button from "../../components/Button"

const passwordLength = parseInt(process.env.PASSWORD_LENGTH)
const maxSecretChars = parseInt(process.env.MAX_SECRET_CHARS)

const FORM_MODE = "FORM_MODE"
const LINK_MODE = "LINK_MODE"

export default function SecretNew() {
  const [mode, setMode] = useState(FORM_MODE)
  const [secret, setSecret] = useState("")
  const [keyPass, setKeyPass] = useState("")

  const handleSecretStored = (keyPass) => {
    setKeyPass(keyPass)
    setMode(LINK_MODE)
  }

  if (mode === FORM_MODE) {
    return (
      <FormMode
        secret={secret}
        setSecret={setSecret}
        onSecretStored={handleSecretStored}
      />
    )
  } else if (mode === LINK_MODE) {
    return <LinkMode keyPass={keyPass} onBackClick={() => setMode(FORM_MODE)} />
  }
}

export function FormMode({ onSecretStored, secret, setSecret }) {
  const handleSubmit = async (event) => {
    event.preventDefault()

    const csrfToken = document.querySelector("[name=csrf-token]")?.content
    const password = generatePassword(passwordLength)

    const secretBlob = await encryptSecret(secret, password)

    const formData = new FormData()
    formData.append("secret", secretBlob)

    const response = await fetch("/api/secrets", {
      method: "POST",
      headers: { "X-Api-Version": "v1", "X-CSRF-Token": csrfToken },
      body: formData,
    })

    const key = await response.json()
    onSecretStored(`${key}#${password}`)
  }

  const secretIsTooLong = secret.length > maxSecretChars

  return (
    <>
      <h1>Share your secret</h1>

      <p>Your secure link lasts for 24 hours, and can only be used once</p>

      <form onSubmit={handleSubmit}>
        <SecretInput
          autoFocus
          value={secret}
          placeholder="Write your secret here..."
          onChange={(event) => setSecret(event.currentTarget.value)}
        />

        <Button
          variant="primary"
          className="float-right"
          disabled={secretIsTooLong}
        >
          {secretIsTooLong
            ? `Secret is too long (${secret.length} / ${maxSecretChars})`
            : "Create link"}
        </Button>
      </form>
    </>
  )
}

export function LinkMode({ keyPass, onBackClick }) {
  return (
    <>
      <h1>Link generated</h1>

      <p>Remember! It can only be used once</p>

      <SecretLink keyPass={keyPass}>
        <Button className="float-right" onClick={onBackClick}>
          Back
        </Button>
      </SecretLink>
    </>
  )
}
