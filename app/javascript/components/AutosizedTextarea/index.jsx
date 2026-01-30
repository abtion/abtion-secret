import { useCallback, useEffect, useRef } from "react"

export default function AutosizedTextarea({
  minHeight = 450,
  onChange,
  ...restProps
}) {
  const textareaRef = useRef()

  const resize = useCallback(() => {
    const element = textareaRef.current

    element.style.height = "0"
    const newHeight = Math.max(minHeight, element.scrollHeight)
    element.style.height = newHeight + "px"
  }, [])

  useEffect(() => {
    if (restProps.autoFocus) {
      const end = textareaRef.current.value.length
      textareaRef.current.setSelectionRange(end, end)
    }

    resize()
    window.addEventListener("resize", resize)

    return () => window.removeEventListener("resize", resize)
  }, [])

  const handleChange = (...args) => {
    if (onChange) onChange(...args)
    resize()
  }

  return (
    <textarea
      rows="1"
      ref={textareaRef}
      onChange={handleChange}
      {...restProps}
    />
  )
}
