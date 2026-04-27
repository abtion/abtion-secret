import { useState } from "react"

import generatePassword from "../../utils/generatePassword"
import encryptSecret from "../../utils/encryptSecret"

import SecretInput from "../SecretInput"
import Button from "../Button"
import InlineSelect from "../InlineSelect"

const passwordLength = parseInt(process.env.PASSWORD_LENGTH)
const maxSecretChars = parseInt(process.env.MAX_SECRET_CHARS)
const maxLifetimeDays = parseInt(process.env.MAX_SECRET_LIFETIME_DAYS)

const lifetimePresets = [1, 3, 7, 14, 30]
const lifetimeOptions = lifetimePresets
  .filter((days) => days <= maxLifetimeDays)
  .map((days) => ({
    value: days,
    label: days === 1 ? "1 day" : `${days} days`,
  }))

export default function SecretForm({ onSecretStored, secret: initialSecret }) {
  const [secret, setSecret] = useState(initialSecret)
  const [lifetimeDays, setLifetimeDays] = useState(lifetimeOptions[0].value)

  const handleSecretChange = (event) => setSecret(event.currentTarget.value)
  const handleLifetimeChange = (event) =>
    setLifetimeDays(parseInt(event.currentTarget.value))

  const handleSubmit = async (event) => {
    event.preventDefault()

    const csrfToken = document.querySelector("[name=csrf-token]")?.content
    const password = generatePassword(passwordLength)

    const secretBlob = await encryptSecret(secret, password)

    const formData = new FormData()
    formData.append("secret", secretBlob)
    formData.append("lifetime_days", lifetimeDays)

    const response = await fetch("/api/secrets", {
      method: "POST",
      headers: { "X-Api-Version": "v1", "X-CSRF-Token": csrfToken },
      body: formData,
    })

    const key = await response.json()
    onSecretStored({ secret, keyPass: `${key}#${password}` })
  }

  const secretIsTooLong = secret.length > maxSecretChars

  return (
    <>
      <h1>Share your secret</h1>

      <form onSubmit={handleSubmit}>
        <p>
          Your secure link lasts for{" "}
          <InlineSelect
            name="lifetime_days"
            value={lifetimeDays}
            onChange={handleLifetimeChange}
            aria-label="Link lifetime"
            options={lifetimeOptions}
          />
          , and can only be used once
        </p>
        <SecretInput
          autoFocus
          value={secret}
          placeholder="Write your secret here..."
          onChange={handleSecretChange}
        />

        <div className="flex justify-end">
          <Button variant="primary" disabled={secretIsTooLong}>
            {secretIsTooLong
              ? `Secret is too long (${secret.length} / ${maxSecretChars})`
              : "Create link"}
          </Button>
        </div>
      </form>
    </>
  )
}
