export default function generatePassword(passwordLength) {
  const hex = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
  let output = ""
  for (let i = 0; i < passwordLength; ++i) {
    output += hex.charAt(Math.floor(Math.random() * hex.length))
  }
  return output
}
