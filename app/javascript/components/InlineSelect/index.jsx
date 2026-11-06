import "./style.scss"

export default function InlineSelect({ options, ...selectProps }) {
  const selected = options.find((option) => option.value === selectProps.value)

  return (
    <span className="InlineSelect">
      {selected?.label}
      <select {...selectProps}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </span>
  )
}
