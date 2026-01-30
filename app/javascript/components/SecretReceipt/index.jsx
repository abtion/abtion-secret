import SecretLink from "../SecretLink"
import Button from "../Button"

export default function LinkMode({ keyPass, onBackClick }) {
  return (
    <>
      <h1>Link generated</h1>

      <p>Remember! It can only be used once</p>

      <SecretLink keyPass={keyPass}>
        <Button onClick={onBackClick}>Back</Button>
      </SecretLink>
    </>
  )
}
