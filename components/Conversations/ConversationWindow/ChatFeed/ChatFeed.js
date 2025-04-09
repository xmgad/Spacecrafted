import { useEffect, useRef, useState } from "react"
import "./ChatFeed.css"

const ChatFeed = ({ messages, myId }) => {
    const feedEndRef = useRef(null)
    const [chatBubbles, setChatBubbles] = useState(null)
    useEffect(() => {
        let lastType = null
        const bubbles = messages.map((message, index) => {
            const messageSender =
                message.senderId === myId ? "current" : "other"
            const sub = messageSender === lastType
            const bubble = {
                key: message._id || index,
                content: message.content,
                sender: messageSender,
                isSubsequent: sub,
            }
            lastType = messageSender
            return bubble
        })
        setChatBubbles(bubbles)
    }, [messages])
    useEffect(() => {
        feedEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [chatBubbles])
    return (
        <div className="chat-feed">
            {chatBubbles &&
                chatBubbles.map((bubble) => (
                    <div
                        key={bubble.key}
                        className={`chat-bubble ${bubble.sender} ${
                            bubble.isSubsequent ? "subsequent" : ""
                        }`}
                    >
                        {bubble.content}
                    </div>
                ))}
            <div ref={feedEndRef} />
        </div>
    )
}

export default ChatFeed
