const searchLocation = async (req, res) => {
    const apiKey = process.env.MAPS_API_KEY
    const { term } = req.query
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        term
    )}&key=${apiKey}&components=country:de`

    try {
        const response = await fetch(url)
        const data = await response.json()

        if (response.ok) {
            const predictions = data.predictions.slice(0, 3).map((pred) => {
                return { description: pred.description, id: pred.place_id }
            })
            res.json(predictions)
        } else {
            res.status(response.status).json({ error: data.status })
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching place suggestions" })
    }
}

const locationCoordinates = async (req, res) => {
    const apiKey = process.env.MAPS_API_KEY
    const { place_id } = req.params
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
        place_id
    )}&key=${apiKey}`
    try {
        const response = await fetch(url)
        const data = await response.json()

        if (response.ok) {
            const { lat, lng } = data.result.geometry.location
            if (lat && lng) res.status(200).json(data.result.geometry.location)
                else res.status(404).json({message: "No coordinates found for this location"})
        } else {
            res.status(response.status).json({ error: data.status })
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching place suggestions" })
    }
}

export { searchLocation, locationCoordinates }
