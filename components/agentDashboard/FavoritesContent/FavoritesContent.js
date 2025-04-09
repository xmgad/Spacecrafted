import "./FavoritesContent.css"

import React, { useEffect, useState } from "react"
import { ReactComponent as FavIcon } from "../../../icons/Favorite.svg"
import ListingView from "../../common/ListingView/ListingView"
import { useAuthContext } from "../../../hooks/useAuthContext"
import SPCButton from "../../common/SPCButton/SPCButton"
import { useNavigate } from "react-router-dom"

const FavoritesList = ({ favorites, onBrowseClick }) => {
    if (favorites.length) {
        return favorites.map((listing) => (
            <ListingView
                listing={listing}
                isFav={true}
            />
        ))
    }

    return (
        <div className="no-listings">
            <p>You have not added any listings to your favorites</p>
            <SPCButton onClick={onBrowseClick}>Browse listings now!</SPCButton>
        </div>
    )
}

const FavoritesContent = () => {
    const { user } = useAuthContext()
    const [favorites, setFavorites] = useState(null)
    const navigate = useNavigate()

    const navigateToListings = () => navigate("/listings")

    useEffect(() => {
        const fetchMyFavorites = async () => {
            const response = await fetch("http://localhost:4000/api/favorite/", {
                headers: { Authorization: `Bearer ${user.token}` },
            })
            const json = await response.json()
            if (response.ok) {
                setFavorites(json)
            } else {
                // TODO: show error
            }
        }
        user ? fetchMyFavorites() : console.error("no user") // TODO: show error
    }, [user])

    return (
        <div className="dashboard-content-container">
            <div className="dashboard-tab-header">
                <FavIcon className="dashboard-tab-header-icon" />
                <p className="gradient-text">My Favorites</p>
            </div>
            <div className="my-listings-content">
                {favorites && (
                    <FavoritesList
                        favorites={favorites}
                        onBrowseClick={navigateToListings}
                    />
                )}
            </div>
        </div>
    )
}

export default FavoritesContent
