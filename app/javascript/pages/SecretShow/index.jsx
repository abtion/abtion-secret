import { useEffect, useState } from "react"

import Button from "../../components/Button"
import SecretInput from "../../components/SecretInput"
import ClipboardCopyButton from "../../components/ClipboardCopyButton"
import decryptSecret from "../../utils/decryptSecret"

const LOADING = "LOADING"
const SUCCESS = "SUCCESS"
const FAILURE = "FAILURE"

export default function SecretShow() {
  const [loadState, setLoadState] = useState(LOADING)
  const [secret, setSecret] = useState("")

  const fetchEncryptedSecret = async (key) => {
    const response = await fetch(`/api/secrets/${key}`, {
      method: "GET",
      headers: { "X-Api-Version": "v1" },
    })
    return await response.blob()
  }

  const initialize = async () => {
    try {
      const key = location.pathname.substr(1)
      const password = location.hash.substr(1)
      const encryptedSecret = await fetchEncryptedSecret(key)
      const secret = await decryptSecret(encryptedSecret, password)

      setSecret(secret)
      setLoadState(SUCCESS)
    } catch (_error) {
      setLoadState(FAILURE)
    }
  }

  useEffect(() => {
    initialize()
  }, [])

  const confirmBackClick = (event) => {
    const shouldNavigate = confirm(
      "If you haven't copied your secret yet, you will loose it.\n\nContinue?",
    )

    if (!shouldNavigate) event.preventDefault()
  }

  if (loadState === LOADING) {
    return <h1>Loading your secret...</h1>
  }

  if (loadState === FAILURE) {
    return (
      <>
        <h1>Your secret is gone...</h1>
        <p>The link is either invalid or has already been consumed</p>

        <a href="/">
          <Button variant="primary">Share a secret</Button>
        </a>
      </>
    )
  }

  return (
    <>
      <h1>Here is your secret</h1>

      <p>The link will NOT work again, so don't close it too early!</p>

      <SecretInput value={secret} readOnly />

      <div className="flex justify-end">
        <a href="/" onClick={confirmBackClick}>
          <Button>Share a secret</Button>
        </a>
        <ClipboardCopyButton value={secret} variant="primary">
          Copy to clipboard
        </ClipboardCopyButton>
      </div>
    </>
  )
}
