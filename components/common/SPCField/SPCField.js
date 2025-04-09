import "./SPCField.css"
import React, { useState } from "react"

const SPCField = ({
  title,
  icon: Icon,
  text,
  onChange,
  placeholder,
  type = "text",
  activeColor = "var(--primary)",
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)
  const accent = isFocused ? activeColor : "white"
  return (
    <div className="spc-field-container">
      <label className="spc-field-label" style={{ color: accent }}>
        {title}
      </label>
      <div
        className="spc-field-input-group"
        style={{ borderBottomColor: accent }}
      >
        {Icon && <Icon className="spc-field-icon" fill={accent} />}
        <input
          type={type}
          className="spc-field-input"
          placeholder={placeholder}
          onChange={onChange}
          value={text}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {/* TODO: add toggle password visibility */}
      </div>
    </div>
  )
}

export default SPCField
