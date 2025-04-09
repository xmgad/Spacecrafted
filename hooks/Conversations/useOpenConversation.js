import { useState } from "react"

export const useOpenConversation = () => {
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    /**
     * Gets all the messages of the conversation and, optionally, marks it as read
     * @param {String} conversationId the ID of the conversation to open
     * @param {String} token the user token for authorization
     * @param {Boolean} markAsRead flag whether the fetched messages should be marked as read
     * @returns a list of the conversation messages
     */
    const openConversation = async (conversationId, markAsRead, token) => {
        setError(null)
        setLoading(true)

        const response = await fetch(
            `http://localhost:4000/api/conversation/${conversationId}/messages`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ markAsRead }),
            }
        )

        const data = await response.json()
        setLoading(false)
        if (!response.ok) {
            setError(data.message)
            return null
        }
        return data
    }

    return { openConversation, isLoading, error }
}
