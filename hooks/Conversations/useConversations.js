import { useState } from "react"

export const useConversations = () => {
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const fetchConversations = async (token) => {
        setError(null)
        setLoading(true)

        const response = await fetch("http://localhost:4000/api/conversation/", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        const data = await response.json()
        if (!response.ok) {
            setError(data.message)
            setLoading(false)
            return null
        }

        setLoading(false)
        return data
    }

    return {fetchConversations, isLoading, error}
}