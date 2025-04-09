import { useState } from "react"

export const useStartConversation = () => {
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const startConversation = async (listingId, startMessage, token) => {
        setError(null)
        setLoading(true)

        const response = await fetch("http://localhost:4000/api/conversation/start", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ listingId, startMessage }),
        })

        const data = await response.json()
        setLoading(false)
        if (!response.ok) {
            setError(data.message)
            return null
        }
        return data
    }

    return { startConversation, isLoading, error }
}
