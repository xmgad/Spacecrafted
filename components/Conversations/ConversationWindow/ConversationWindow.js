import "./ConversationWindow.css"
import React, { useEffect, useRef, useState } from "react"
import { getOther, getOtherName } from "../../../utils/ConversationUtils"
import { useAuthContext } from "../../../hooks/useAuthContext"
import { ReactComponent as SendIcon } from "../../../icons/Send.svg"
import ChatFeed from "./ChatFeed/ChatFeed"
import { useOpenConversation } from "../../../hooks/Conversations/useOpenConversation"
import { ClipLoader } from "react-spinners"

const ChatContent = ({ messages, isLoading, error, myId }) => {
    switch (true) {
        case isLoading:
            return (
                <div className="chat-loading-container">
                    <ClipLoader color="var(--primary)" size={60} />
                </div>
            )
        case error != null:
            return <div className="chat-error">{error}</div>
        case messages && messages.length !== 0:
            return <ChatFeed messages={messages} myId={myId} />
        default:
            return (
                <div className="empty-chat">
                    This conversation is empty, type a message below to start!
                </div>
            )
    }
}

const ChatInput = ({ input, onInputChange, onSend, maxHeight }) => {
    const textareaRef = useRef(null)
    useEffect(() => {
        const textarea = textareaRef.current
        const handleKeyDown = (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                onSend(textarea.value)
            }
        }
        textarea.addEventListener("keydown", handleKeyDown)
        return () => {
            textarea.removeEventListener("keydown", handleKeyDown)
        }
    }, [onSend])

    useEffect(() => {
        const textarea = textareaRef.current
        textarea.style.height = "auto"
        textarea.style.height = `${Math.min(
            maxHeight - 20,
            textarea.scrollHeight
        )}px`
    }, [input])

    return (
        <textarea
            rows={1}
            ref={textareaRef}
            type="text"
            className="chat-box-field"
            value={input}
            placeholder="Message"
            onChange={(e) => {
                onInputChange(e.target.value)
            }}
        />
    )
}

const ConversationWindow = ({
    conversation,
    chatMessages,
    setChatMessages,
    onSendMessage,
    isMessageSending,
}) => {
    const { user } = useAuthContext()
    const [message, setMessage] = useState("")
    const { openConversation, isLoading, error } = useOpenConversation()
    const chatBoxMaxHeight = 150

    useEffect(() => {
        const fireOpenConversation = async () => {
            const messages = await openConversation(
                conversation._id,
                true,
                user.token
            )
            if (messages) setChatMessages(messages)
        }
        if (!user || !conversation) return
        fireOpenConversation()
    }, [user, conversation._id])

    const goToListing = () => {
        console.log("go to listing")
    }

    const sendMessage = (msg) => {
        const sentMessage = msg || message
        if (sentMessage.length) {
            const messageObject = {
                conversationId: conversation._id,
                content: sentMessage,
                senderId: user.id,
                recipientId: getOther(conversation.participants, user.id)
                    .userId,
            }
            onSendMessage(messageObject)
            setMessage("")
        }
    }

    const title = user ? getOtherName(conversation.participants, user.id) : "?"
    return (
        <div className="conversation-window">
            <div className="chat-header">
                <img
                    onClick={goToListing}
                    src={conversation.imageUrl}
                    alt="listing preview"
                />
                <div className="chat-header-info">
                    <p className="chat-header-title">{title}</p>
                    <p className="chat-header-description">
                        {conversation.title}
                    </p>
                </div>
            </div>
            <div className="chat-content">
                <ChatContent
                    messages={chatMessages}
                    isLoading={isLoading}
                    error={error}
                    myId={user.id}
                />
            </div>
            <div className="chat-box-container">
                <div
                    className="chat-box"
                    style={{ maxHeight: { chatBoxMaxHeight } }}
                >
                    <ChatInput
                        input={message}
                        onInputChange={setMessage}
                        onSend={sendMessage}
                        maxHeight={chatBoxMaxHeight}
                    />
                    {isMessageSending ? (
                        <ClipLoader className="chat-send-button" color="var(--primary)" size={44} />
                    ) : (
                        <SendIcon
                            onClick={() => sendMessage(message)}
                            className="chat-send-button"
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ConversationWindow
