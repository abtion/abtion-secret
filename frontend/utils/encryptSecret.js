import { createMessage, encrypt } from "openpgp/lightweight"

export default async function (secret, password) {
  const message = await createMessage({ text: secret })

  const binary = await encrypt({
    message,
    passwords: [password],
    format: "binary",
  })

  return new Blob([binary])
}
