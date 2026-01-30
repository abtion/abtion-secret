import ClipboardCopyButton from "../ClipboardCopyButton"

import "./style.scss"

export default function SecretLink({ children, keyPass }) {
  const link = `${location.origin}/${keyPass}`

  return (
    <>
      <div className="SecretLink__url-container">
        <input type="text" className="SecretLink__url" readOnly value={link} />
      </div>

      <div className="flex justify-end">
        {children}
        <ClipboardCopyButton variant="primary" value={link}>
          Copy to clipboard
        </ClipboardCopyButton>
      </div>
    </>
  )
}
