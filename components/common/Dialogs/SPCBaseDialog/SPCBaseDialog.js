import "./SPCBaseDialog.css"
import React from "react"
import Modal from "react-modal"

Modal.setAppElement('#root')

const SPCBaseDialog = ({ isOpen, onRequestClose, className, contentLabel, children }) => {
    const cName = `base-dialog-content ${className}`
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel={contentLabel}
            closeTimeoutMS={250}
            overlayClassName={{
                base: 'base-dialog-overlay',
                afterOpen: 'dialog-overlay--after-open',
                beforeClose: 'dialog-overlay--before-close'
            }}
            className={{
                base: cName,
                afterOpen: 'dialog-content--after-open',
                beforeClose: 'dialog-content--before-close'
            }}
        >
            {children}
        </Modal>
    )
}

export default SPCBaseDialog
