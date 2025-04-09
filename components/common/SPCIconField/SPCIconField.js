import "./SPCIconField.css"

const SPCIconField = ({
    value,
    icon: Icon,
    tint = "var(--primary)",
    isIconStroke = true,
    onChange,
    onFocus,
    onBlur,
    className,
    placeholder,
    fontSize = "14px",
    ...props
}) => {
    const cName = `icon-field ${className}`
    const icStyle = {
        ...(isIconStroke && { stroke: tint }),
        ...(!isIconStroke && { fill: tint }),
    }
    return (
        <div className={cName}>
            {Icon && <Icon style={icStyle} className="icon-field-icon" />}
            <input
                type="text"
                className="icon-filed-input"
                style={{fontSize: fontSize}}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                onFocus={onFocus}
                onBlur={onBlur}
                {...props}
            />
        </div>
    )
}

export default SPCIconField
