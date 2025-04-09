import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import ListingDetailInfo from "../../components/listingDetail/ListingDetailInfo"
import ListingDetailImages from "../../components/listingDetail/ListingDetailImages"
import "./ListingDetailPage.css"
import MapView from "../../components/common/MapView/MapView"

const ListingDetailPage = () => {
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { id } = useParams()

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/listing/${id}`)
                if (!response.ok) {
                    throw new Error("Failed to fetch listing")
                }
                const data = await response.json()
                setListing(data)
                setLoading(false)
            } catch (err) {
                setError(err.message)
                setLoading(false)
            }
        }

        fetchListing()
    }, [id])

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>
    if (!listing) return <div>No listing found</div>
    const listingCoordinates = listing.location.coordinates
    const [lng, lat] = listingCoordinates.longlat
    return (
        <div className="listing-detail">
            <div className="detail-header">
                <h1>Listing Details</h1>
            </div>
            <div className="listing-detail-content">
                <div className="listing-details-left-section">
                    <ListingDetailImages images={listing.images} />
                    <div className="listing-details-header">Location</div>
                    <MapView
                        className="listing-details-map"
                        location={{lng, lat}}
                        isPreview={true}
                        topWidget="directions"
                    />
                </div>
                <ListingDetailInfo listing={listing} />
            </div>
        </div>
    )
}

export default ListingDetailPage
