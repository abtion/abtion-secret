import ClipboardCopyButton from "../ClipboardCopyButton"

import "./style.scss"

export default function SecretLink({ children, keyPass }) {
  const link = `${location.origin}/${keyPass}`

  return (
    <>
      <div className="SecretLink__url-container">
        <input type="text" className="SecretLink__url" readOnly value={link} />
      </div>

      <div className="SecretLink__buttons">
        <ClipboardCopyButton
          variant="primary"
          className="float-right"
          value={link}
        >
          Copy to clipboard
        </ClipboardCopyButton>
        {children}
      </div>
    </>
  )
}
