import { useState } from "react"
import { useAuthContext } from "../useAuthContext"

export const useDeleteListing = () => {
    const [error, setError] = useState(null)
    const [isLoading, setLoading] = useState(null)

    const { user } = useAuthContext()

    const deleteListing = async (listingId, onSuccess) => {
        setLoading(true)
        setError(null)

        const response = await fetch(`http://localhost:4000/api/listing/${listingId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        })

        const json = await response.json()
        if (!response.ok) {
            // Request failed
            setLoading(false)
            setError(json.message) // TODO: make sure this is the correct error response format
            return
        }

        setLoading(false) // end loading
        console.log("LISTING DELETED!!!")
        onSuccess()
    }

    return { deleteListing, isLoading, error }
}
