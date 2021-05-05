export default function autoresize(element, minHeight = 0) {
  const resize = () => {
    element.style.height = "0"
    const newHeight = Math.max(minHeight, element.scrollHeight)
    element.style.height = newHeight + "px"
  }

  element.addEventListener("input", resize)
  resize()
}
