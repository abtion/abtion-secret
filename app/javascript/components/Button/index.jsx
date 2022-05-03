import React from "react"
import classNames from "classnames"

import "./style.scss"

export default function Button({
  variant = "secondary",
  className,
  ...restProps
}) {
  const combinedClassName = classNames(
    "Button",
    `Button--${variant}`,
    className
  )

  return <button className={combinedClassName} {...restProps} />
}
