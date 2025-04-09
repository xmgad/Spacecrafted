import { useState } from "react"
import { useAuthContext } from "../useAuthContext.js"


export const useNotification = () => {
    const [error, setError] = useState(null)
    const [isLoading, setLoading] = useState(null)

    const { user } = useAuthContext()

    const getMyNotifications = async () => {
        setError(null)
        setLoading(true)

        const response = await fetch("http://localhost:4000/api/notification", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${user.token}`,
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

    return {getMyNotifications, isLoading, error}
}