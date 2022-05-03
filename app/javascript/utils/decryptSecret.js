import { decrypt, readMessage } from "openpgp/lightweight"

export default async function descryptSecret(encryptedSecret, password) {
  const binaryMessage = new Uint8Array(await encryptedSecret.arrayBuffer())
  const result = await decrypt({
    message: await readMessage({ binaryMessage }),
    passwords: [password],
  })

  return result.data
}
