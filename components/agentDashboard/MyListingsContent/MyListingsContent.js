import React, { useEffect, useState } from "react"
import "./MyListingsContent.css"
import { ReactComponent as ListingIcon } from "../../../icons/Listing.svg"
import { ReactComponent as CreateIcon } from "../../../icons/Create.svg"
import ListingView from "../../common/ListingView/ListingView"
import { useAuthContext } from "../../../hooks/useAuthContext"
import SPCButton from "../../common/SPCButton/SPCButton"
import { useNavigate } from "react-router-dom"

const ListingsList = ({ listingsAndFavs, onCreateClick }) => {
    const { listings, favIds } = listingsAndFavs
    if (listings.length) {
        return listings.map((listing) => (
            <ListingView
                listing={listing}
                isFav={favIds.includes(listing._id)}
            />
        ))
    }

    return (
        <div className="no-listings">
            <p>You do not have any listings yet</p>
            <SPCButton onClick={onCreateClick}>Create a listing now!</SPCButton>
        </div>
    )
}

const MyListingsContent = () => {
    const { user } = useAuthContext()
    const [listingsAndFavs, setListingsAndFavs] = useState(null)
    const navigate = useNavigate()

    const navigateToCreate = () => navigate("/create-listing")

    useEffect(() => {
        const fetchMyListingsAndFavs = async () => {
            const reqOptions = {
                headers: { Authorization: `Bearer ${user.token}` },
            }
            const userResponse = await fetch(
                "http://localhost:4000/api/user/me/favorites",
                reqOptions
            )
            const response = await fetch("http://localhost:4000/api/listing/my-listings", reqOptions)
            const json = await response.json()
            if (response.ok) {
                let { favorites } = await userResponse.json()
                setListingsAndFavs({ listings: json, favIds: favorites })
            } else {
                // TODO: show error
            }
        }
        user ? fetchMyListingsAndFavs() : console.error("no user") // TODO: show error
    }, [user])

    const editClicked = (listingId) => navigate(`/update-listing/${listingId}`)

    return (
        <div className="dashboard-content-container">
            <div className="dashboard-tab-header">
                <ListingIcon className="dashboard-tab-header-icon" />
                <p className="gradient-text">My Listings</p>
                <SPCButton
                    className="listings-header-create"
                    onClick={() => navigate("/create-listing")}
                    icon={CreateIcon}
                    isIconStroke={false}
                    tint="var(--purple)"
                >
                    Create listing
                </SPCButton>
            </div>
            <div className="my-listings-content">
                {listingsAndFavs && (
                    <ListingsList
                        listingsAndFavs={listingsAndFavs}
                        onCreateClick={navigateToCreate}
                    />
                )}
            </div>
        </div>
    )
}

export default MyListingsContent
