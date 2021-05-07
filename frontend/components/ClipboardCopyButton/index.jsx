import React from "react"

import Button from "../Button"

export default function ClipboardCopyButton({ value, ...restProps }) {
  const handleCopyClick = () => {
    navigator.clipboard.writeText(value)
  }

  return <Button onClick={handleCopyClick} {...restProps} />
}
