import { getOtherName } from "../../../utils/ConversationUtils";
import { timeAgo } from "../../../utils/DateUtils";
import "./ConversationView.css"
import React from "react"

const ConversationView = ({ conversation, myId, isSelected, hasNewMessages, onConversationClick }) => {
    let className = "conversation-view"
    if (isSelected)
        className += " selected"
    else if (hasNewMessages)
        className += " has-new"

    const otherName = getOtherName(conversation.participants, myId)
    const time = timeAgo(new Date(conversation.updatedAt))
    return <div className={className} onClick={() => onConversationClick(conversation) }>
        <img className="conversation-image" src={conversation.imageUrl} alt="conversation listing preview" />
        <div className="conversation-view-info">
            <p className="conversation-view-title">{otherName}</p>
            <p className="conversation-view-description">{conversation.title}</p>
            <p className="conversation-view-time">{time}</p>
        </div>
    </div>
}

export default ConversationView