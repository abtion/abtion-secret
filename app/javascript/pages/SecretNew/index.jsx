import { useState } from "react"

import SecretForm from "../../components/SecretForm"
import SecretReceipt from "../../components/SecretReceipt"

const FORM_MODE = "FORM_MODE"
const LINK_MODE = "LINK_MODE"

export default function SecretNew() {
  const [mode, setMode] = useState(FORM_MODE)
  const [secret, setSecret] = useState("")
  const [keyPass, setKeyPass] = useState("")

  const handleSecretStored = ({ secret, keyPass }) => {
    setSecret(secret)
    setKeyPass(keyPass)
    setMode(LINK_MODE)
  }

  if (mode === FORM_MODE) {
    return <SecretForm secret={secret} onSecretStored={handleSecretStored} />
  } else {
    return (
      <SecretReceipt keyPass={keyPass} onBackClick={() => setMode(FORM_MODE)} />
    )
  }
}
