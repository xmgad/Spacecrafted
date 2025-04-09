import { useState } from "react"

export const useFetchListings = () => {
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchListings = async (queryString) => {
        setError(null)
        setLoading(true)
        const url = `http://localhost:4000/api/listing${queryString}`
        const response = await fetch(url)

        const data = await response.json()

        setLoading(false)
        if (!response.ok) {
            setError(data.message)
            return
        }

        return data
    }

    return  {fetchListings, isLoading, error}
}
