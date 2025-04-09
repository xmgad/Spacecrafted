import { Route, Routes, useNavigate, useParams } from "react-router-dom"
import ConversationView from "../../components/Conversations/ConversationView/ConversationView"
import { useConversations } from "../../hooks/Conversations/useConversations"
import { useAuthContext } from "../../hooks/useAuthContext"
import { ReactComponent as ChatIcon } from "../../icons/Chat.svg"
import "./ConversationsPage.css"
import React, { useEffect, useRef, useState } from "react"
import ConversationWindow from "../../components/Conversations/ConversationWindow/ConversationWindow"
import { io } from "socket.io-client"

const connectToSocket = (userId, onSocket, onNewMessage) => {
    const newSocket = io("", {
        query: { userId },
    })

    newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id)
        onSocket(newSocket)
    })

    newSocket.on("receiveMessage", (message) => {
        onNewMessage(message)
    })

    newSocket.on("disconnect", () => {
        console.log("Socket disconnected")
        onSocket(null)
    })
}

const ConversationList = ({
    className,
    conversations,
    selected,
    onConversationClick,
}) => {
    const { user } = useAuthContext()
    const selectedId = selected ? selected._id : null
    if (conversations.length) {
        return (
            <div className={className}>
                {conversations.map((conversationEntry) => (
                    <ConversationView
                        key={conversationEntry.conversation._id}
                        conversation={conversationEntry.conversation}
                        myId={user.id}
                        isSelected={
                            conversationEntry.conversation._id === selectedId
                        }
                        hasNewMessages={conversationEntry.hasNewMessages}
                        onConversationClick={onConversationClick}
                    />
                ))}
            </div>
        )
    }
    return (
        <div className={`${className} no-conversations`}>
            No conversations yet
        </div>
    )
}

const Conversations = () => {
    const params = useParams()
    const navigate = useNavigate()
    const [socket, setSocket] = useState(null)
    const [selectedConversation, setSelectedConversation] = useState(null)
    const [currentMessages, setCurrentMessages] = useState(null)
    const [fetchRequired, setFetchRequired] = useState(false)
    const [conversationsAndStatuses, setConversationsAndStatuses] =
    useState(null)
    const [messageSending, setMessageSending] = useState(false)
    const { fetchConversations, isLoading, error } = useConversations()
    const { user } = useAuthContext()
    const selectedConversationRef = useRef(selectedConversation)
    // Set ref for selected conversation - solves stale reference issue in receive message closure
    useEffect(() => {
        selectedConversationRef.current = selectedConversation
    }, [selectedConversation])

    useEffect(() => {
        if (!user) return
        setFetchRequired(true)
        // Connect to socket
        connectToSocket(user.id, setSocket, receiveMessage)
    }, [user])

    useEffect(() => {
        if (!user || !fetchRequired) return
        const getConversations = async () => {
            const newConversations = await fetchConversations(user.token)
            if (newConversations) setConversationsAndStatuses(newConversations)
            setFetchRequired(false)
        }
        // Get conversations
        getConversations()
    }, [user, fetchRequired])

    // Set selected conversation
    useEffect(() => {
        if (!conversationsAndStatuses) return
        let selected
        const id = params["*"]
        if (id.length) {
            selected = conversationsAndStatuses.find(
                (conv) => conv.conversation._id === id
            ).conversation
        }
        setSelectedConversation(selected)
    }, [params, conversationsAndStatuses])

    // Notify socket of currently open conversation
    useEffect(() => {
        if (socket) {
            const openConvId = selectedConversation
                ? selectedConversation._id
                : null
            socket.emit("openConversation", openConvId)
        }
    }, [selectedConversation])

    const reorderConversations = (mostRecentId, isMostRecentSelected) => {
        setConversationsAndStatuses((old) => {
            const oldMostRecent = old.find((convAndStatus) => {
                return convAndStatus.conversation._id === mostRecentId
            })
            if (!oldMostRecent) {
                // new chat, refetch
                setFetchRequired(true)
                return old
            }
            const newMostRecent = {
                conversation: {
                    ...oldMostRecent.conversation,
                    updatedAt: new Date(),
                },
                hasNewMessages: !isMostRecentSelected,
            }

            const updatedConvAndStatuses = [
                newMostRecent,
                ...old.filter((cAndS) => cAndS !== oldMostRecent),
            ]
            return updatedConvAndStatuses
        })
    }

    const receiveMessage = (newMessage) => {
        const isForSelected =
            newMessage.conversationId === selectedConversationRef.current?._id
        if (isForSelected)
            setCurrentMessages((messages) => [...messages, newMessage])
        reorderConversations(newMessage.conversationId, isForSelected)
    }

    const sendMessage = (message) => {
        if (socket) {
            setMessageSending(true)
            socket.emit("sendMessage", message, (response) => {
                setCurrentMessages((messages) => [...messages, message])
                reorderConversations(message.conversationId, true)
                setMessageSending(false)
                console.log("Message status:", response)
            })
        }
    }

    const handleConversationClick = (conversation) => {
        const selectedId = selectedConversation
            ? selectedConversation._id
            : null
        if (conversation._id === selectedId) return
        navigate(`/conversations/${conversation._id}`)
    }

    return (
        <div className="conversations-page">
            <aside className="conversation-list-pane">
                <div className="conversation-list-header">
                    <ChatIcon className="conversation-list-icon" />
                    <p>My conversations</p>
                </div>
                {conversationsAndStatuses && (
                    <ConversationList
                        className="conversation-list"
                        conversations={conversationsAndStatuses}
                        selected={selectedConversation}
                        onConversationClick={handleConversationClick}
                    />
                )}
                {isLoading && <div>Loading conversations</div>}
                {error && (
                    <div className="error">Failed to load conversations</div>
                )}
            </aside>
            <div className="conversation-window-container">
                <Routes>
                    <Route
                        path=":conversationId"
                        element={
                            selectedConversation && (
                                <ConversationWindow
                                    conversation={selectedConversation}
                                    chatMessages={currentMessages}
                                    setChatMessages={setCurrentMessages}
                                    onSendMessage={sendMessage}
                                    isMessageSending={messageSending}
                                />
                            )
                        }
                    />
                </Routes>
            </div>
        </div>
    )
}

export default Conversations
