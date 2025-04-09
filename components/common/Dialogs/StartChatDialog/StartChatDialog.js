import "./StartChatDialog.css"
import React, { useState } from "react"
import SPCButton from "../../SPCButton/SPCButton"
import SPCLoadingButton from "../../SPCLoadingButton/SPCLoadingButton"
import { ReactComponent as LocationIcon } from "../../../../icons/Location.svg"
import { useStartConversation } from "../../../../hooks/Conversations/useStartConversation"
import { useAuthContext } from "../../../../hooks/useAuthContext"
import SPCBaseDialog from "../SPCBaseDialog/SPCBaseDialog"

const StartChatDialog = ({ isOpen, listing, onCancel, onCreated }) => {
    const tint = "var(--primary)"
    const previewImageUrl = listing.images[0].url
    const { user } = useAuthContext()
    const [message, setMessage] = useState(
        "Hello, I'm interested in this listing!"
    )
    const { startConversation, isLoading, error } = useStartConversation()
    const [validationError, setValidationError] = useState(null)

    const convError = error || validationError
    const createConversation = async () => {
        if (!message || !message.length) {
            return setValidationError("Please enter a starting message")
        }
        const conversation = await startConversation(
            listing._id,
            message,
            user.token
        )
        if (conversation) onCreated(conversation)
        
    }

    return (
        <SPCBaseDialog
            isOpen={isOpen}
            className="chat-dialog"
            contentLabel="Chat"
        >
            <h2 className="dialog-title" style={{ color: tint }}>
                Start a conversation
            </h2>
            <div className="dialog-message">
                Get in contact with the listing owner and seal the deal!
            </div>
            <div className="start-chat-box">
                <div className="start-chat-box-header">
                    <img src={previewImageUrl} alt="listing preview" />
                    <div className="start-chat-listing-info">
                        <p className="start-chat-box-header-title">{listing.title}</p>
                        <p className="start-chat-box-header-description">{listing.description}</p>
                        <div className="start-chat-listing-location">
                            <LocationIcon className="icon" />
                            <p>{listing.location.description}</p>
                        </div>
                    </div>
                </div>
                <h4>Message</h4>
                <textarea
                    type="text"
                    className="start-chat-box-field"
                    value={message}
                    placeholder="Starting message"
                    onChange={(e) => {
                        setMessage(e.target.value)
                    }}
                />
            </div>
            {convError && <div className="start-chat-error">{convError}</div>}
            <div className="dialog-buttons">
                <SPCLoadingButton
                    onClick={createConversation}
                    loading={isLoading}
                    tint={tint}
                >
                    Start conversation
                </SPCLoadingButton>
                <SPCButton
                    buttonType="text"
                    disabled={isLoading}
                    onClick={onCancel}
                    tint={tint}
                >
                    Cancel
                </SPCButton>
            </div>
        </SPCBaseDialog>
    )
}

export default StartChatDialog
