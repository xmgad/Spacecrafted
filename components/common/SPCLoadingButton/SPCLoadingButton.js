import React from "react"
import SPCButton from "../SPCButton/SPCButton" // Ensure correct path
import { ClipLoader } from "react-spinners"
import "./SPCLoadingButton.css"

const SPCLoadingButton = ({
  loading,
  children,
  disabled,
  type = "submit",
  buttonType = "default",
  tint = "var(--primary)",
  className,
  ...props
}) => {
  const spinnerColor = buttonType === "default" ? "#ffffff" : tint
  const cName = `${buttonType} ${className} ${loading ? "loading" : ""}`
  return (
    <SPCButton
      buttonType={buttonType}
      tint={tint}
      className= {cName}
      type={type}
      {...props}
      disabled={loading || disabled}
    >
      <span style={{ visibility: loading ? "hidden" : "visible" }}>
        {children}
      </span>
      {loading && (
        <div className="spinner-container">
          <ClipLoader color={spinnerColor} size={20} />
        </div>
      )}
    </SPCButton>
  )
}

export default SPCLoadingButton
