import { useState } from "react"


export const useGetSubscription = () => {
    const [error, setError] = useState(null)
    const [isLoading, setLoading] = useState(null)

    const getSubscription = async (userId,token) => {
        setError(null)
        setLoading(true)
        const response = await fetch(`http://localhost:4000/api/subscription/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        const data = await response.json()
        setLoading(false)
        if (!response.ok) {
            setError(data.message)
            return null
        }

        return data
    }

    return {getSubscription, isLoading, error}
}