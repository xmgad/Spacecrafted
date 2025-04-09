import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./ListingView.css"
import { ReactComponent as LocationIcon } from "../../../icons/Location.svg"
import { ReactComponent as FavIcon } from "../../../icons/Favorite.svg"
import { ReactComponent as EditIcon } from "../../../icons/Edit.svg"
import { useAuthContext } from "../../../hooks/useAuthContext"
import { useFavorite } from "../../../hooks/Favorite/useFavorite"
import SPCDialog from "../Dialogs/SPCDialog/SPCDialog"
import RegisterDialog from "../Dialogs/RegisterDialog/RegisterDialog"

const ListingView = ({ listing, isFav }) => {
    const [isFavorite, setFavorite] = useState(isFav)
    const { user } = useAuthContext()
    const [showRegisterDialog, setShowRegisterDialog] = useState(false)
    const { favoriteListing, isLoading } = useFavorite()
    const navigate = useNavigate()

    const isMyListing = user ? listing.userId === user.id : false

    const handleFavorite = async (e) => {
        e.stopPropagation()
        if (!user) {
            setShowRegisterDialog(true)
            return
        }
        const newState = await favoriteListing(listing._id, user.token)
        if (newState != null) {
            setFavorite(newState)
        }
    }

    const handleEdit = (e) => {
        e.stopPropagation()
        navigate(`/update-listing/${listing._id}`)
    }

    const formatPrice = (amount) => {
        return Intl.NumberFormat().format(amount)
    }
    const image = listing.images[0]
    return (
        <div className="listing-view">
            <img
                src={image ? image.url : ""}
                alt="listing cover"
                className="listing-image"
            />
            <div className="lv-content">
                <div className="lv-info">
                    <Link
                        to={`/listing/${listing._id}`}
                        className="lv-title-link"
                    >
                        <p className="lv-title">{listing.title}</p>
                    </Link>
                    <p className="lv-desc">{listing.description}</p>
                    <div className="lv-location">
                        <div className="lv-location-content">
                            <LocationIcon className="lv-location-icon" />
                            <p className="lv-location-name">
                                {listing.location.description}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="lv-side">
                    <div className="lv-buttons">
                        {isMyListing && (
                            <EditIcon
                                onClick={handleEdit}
                                className="lv-button lv-edit-button"
                            />
                        )}
                        <FavIcon
                            onClick={handleFavorite}
                            className={`lv-button lv-fav-button 
                            ${isLoading ? "disabled" : ""}
                            ${isFavorite ? "selected" : ""}`}
                        />
                    </div>
                    <p className="lv-price">{formatPrice(listing.price)} €</p>
                </div>
            </div>
            <RegisterDialog
                isOpen={showRegisterDialog}
                onRequestClose={() => setShowRegisterDialog(false)}
            ></RegisterDialog>
        </div>
    )
}

export default ListingView
