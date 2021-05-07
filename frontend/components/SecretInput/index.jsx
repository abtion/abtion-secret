import React from "react"
import AutosizedTextarea from "../AutosizedTextarea"

import "./style"

export default function SecretInput(props) {
  return (
    <div className="SecretInput">
      <AutosizedTextarea
        name="secret"
        className="SecretInput__textarea"
        {...props}
      ></AutosizedTextarea>
    </div>
  )
}
