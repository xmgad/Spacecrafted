import { useState } from "react"
import { useAuthContext } from "../useAuthContext"


export const useFavorite = () => {
    const [error, setError] = useState(null)
    const [isLoading, setLoading] = useState(null)

    const favoriteListing = async (listingId, token) => {
        setError(null)
        setLoading(true)
        const response = await fetch(`http://localhost:4000/api/favorite/${listingId}`, {
            method: "POST",
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
        return data.newFavoriteState
    }

    return {favoriteListing, isLoading, error}
}