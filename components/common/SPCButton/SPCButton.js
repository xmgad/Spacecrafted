import React from "react"
import "./SPCButton.css"

const SPCButton = ({
    children,
    onClick,
    className,
    type = "submit",
    buttonType = "default",
    tint = "var(--primary)",
    icon: Icon,
    iconPosition = "left",
    isIconStroke = true,
    ...props
}) => {
    const style = {
        ...(buttonType === "outlined" && { color: tint, borderColor: tint }),
        ...(buttonType === "text" && { color: tint }),
        ...(buttonType === "default" && { background: tint, color: "white" }),
        ...(buttonType === "default_light" && {
            background: "white",
            color: tint,
        }),
    }

    const icName = `spc-button-icon ${iconPosition}`
    const icTint = buttonType === "default" ? "white" : tint
    const icStyle = {
        ...(isIconStroke && { stroke: icTint }),
        ...(!isIconStroke && { fill: icTint }),
    }

    return (
        <button
            type={type}
            className={`spc-button ${buttonType} ${className}`}
            onClick={onClick}
            style={style}
            {...props}
        >
            {Icon && iconPosition === "left" && (
                <Icon className={icName} style={icStyle} />
            )}
            {children}
            {Icon && iconPosition === "right" && (
                <Icon className={icName} style={icStyle} />
            )}
        </button>
    )
}

export default SPCButton
