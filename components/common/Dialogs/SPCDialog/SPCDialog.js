import React from "react"
import "./SPCDialog.css"
import SPCButton from "../../SPCButton/SPCButton"
import SPCBaseDialog from "../SPCBaseDialog/SPCBaseDialog"

const SPCDialog = ({
    isOpen,
    title,
    message,
    tint="var(--primary)",
    confirmTitle,
    onRequestClose,
    onConfirm,
}) => {
    return (
        <SPCBaseDialog
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Confirm Deletion"
            className="spc-dialog"
        >
            <h2 className="dialog-title" style={{color: tint}}>{title}</h2>
            <div className="dialog-message">{message}</div>
            <div className="dialog-buttons">
                <SPCButton onClick={onConfirm} tint={tint}>{confirmTitle}</SPCButton>
                <SPCButton buttonType="text" onClick={onRequestClose} tint={tint}>
                    Cancel
                </SPCButton>
            </div>
        </SPCBaseDialog>
    )
}

export default SPCDialog
