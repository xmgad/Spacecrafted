import "./MultiOptionView.css"
import React from "react"

const MultiOptionView = ({
    options,
    selected,
    setSelected,
    className,
    deselectable = true,
}) => {
    const handleClick = (index) => {
        if (index !== selected) return setSelected(index)
        if (deselectable) {
            setSelected(null)
        }
    }

    const cName = `multi-option-view ${className}`
    return (
        <div className={cName}>
            {options.map((option, index) => (
                <div
                    className={`option-block ${
                        index === 0
                            ? "start"
                            : index === options.length - 1
                            ? "end"
                            : ""
                    } ${index === selected ? "selected" : ""}`}
                    onClick={() => handleClick(index)}
                >
                    {option}
                </div>
            ))}
        </div>
    )
}

export default MultiOptionView
