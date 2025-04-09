import { useState } from "react"
import { useAuthContext } from "../useAuthContext"

export const useUpdateListing = () => {
    const [error, setError] = useState(null)
    const [isLoading, setLoading] = useState(null)

    const { user } = useAuthContext()

    const validateInput = (title, price, description, location, images) => { // TODO: refactor listing validation
        if (!title || !description || !location.description || !price) {
            throw Error("Please fill all in required fields")
        }

        if (price < 0 || price > 9999999999) {
            throw Error("Please enter a valid price")
        }

        if (!images.filter((item) => item !== null).length) {
            throw Error("Please add at least one image")
        }
    }

    const makeBody = (title, price, description, location, images, removeKeys) => {
        const formData = new FormData()
        images.forEach((file) => {
            // ensure not null
            if (file && (file instanceof File || file instanceof Blob)) {
                formData.append("images", file)
            }
        })
        const data = JSON.stringify({
            title,
            description,
            price,
            location,
        })
        formData.append("data", data)
        formData.append("remove", JSON.stringify({removeKeys}))

        return formData
    }

    const updateListing = async (listingId, title, price, description, location, images, removeKeys, onSuccess) => {
        setLoading(true)
        setError(null)

        try {
            validateInput(title, price, description, location, images)
        } catch (e) {
            setLoading(false)
            setError(e.message)
            return
        }

        const response = await fetch(`http://localhost:4000/api/listing/${listingId}`, {
            method: "PATCH",
            body: makeBody(title, price, description, location, images, removeKeys),
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
        console.log("LISTING PATCHED!!!")
        onSuccess()
    }

    return { updateListing, isLoading, error }
}
