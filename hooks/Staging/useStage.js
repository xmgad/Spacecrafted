import { useState } from "react"
import { useAuthContext } from "../useAuthContext"

export const useStage = () => {
    const [error, setError] = useState(null)
    const [isLoading, setLoading] = useState(null)

    const { user } = useAuthContext()

    const stageImage = async (image) => {
        setLoading(true)
        setError(null)
        let body
        let headers = {
            Authorization: `Bearer ${user.token}`,
        }

        if (image.url) {
            body = JSON.stringify({ imageUrl: image.url })
            headers["Content-Type"] = "application/json"
        } else {
            body = new FormData()
            body.append("image", image)
        }

        const response = await fetch("http://localhost:4000/api/stage", {
            method: "POST",
            body: body,
            headers: headers,
        })

        if (!response.ok) {
            // Request failed
            const json = await response.json()
            setLoading(false)
            setError(json.message) // TODO: make sure this is the correct error response format
            return
        }
        setLoading(false)
        const stagedImageBlob = await response.blob()
        const stagedImage = new File([stagedImageBlob], "staged.jpg", { type: stagedImageBlob.type });
        return stagedImage
    }

    return { stageImage, isLoading, error }
}
