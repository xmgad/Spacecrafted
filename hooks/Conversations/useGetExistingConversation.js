import { useState } from "react"

export const useGetExistingConversation = () => {
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const getExistingConversation = async (
        listingId,
        onExisting,
        onNew,
        token
    ) => {
        setError(null)
        setLoading(true)

        const response = await fetch("http://localhost:4000/api/conversation/get", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ listingId }),
        })

        const data = await response.json()
        setLoading(false)
        if (!response.ok) {
            if (response.status === 405) {
                onNew()
            } else {
                setError(data.message)
            }
            return null
        }
        onExisting(data)
    }

    return { getExistingConversation, isLoading, error }
}
