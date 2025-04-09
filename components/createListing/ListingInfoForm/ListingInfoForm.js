import React, { useState } from "react"
import { ReactComponent as DescriptionIcon } from "../../../icons/Description.svg"
import { ReactComponent as LocationIcon } from "../../../icons/Location.svg"
import { ReactComponent as EuroIcon } from "../../../icons/Euro.svg"
import SPCLoadingButton from "../../common/SPCLoadingButton/SPCLoadingButton"
import "./ListingInfoForm.css"
import MapView from "../../common/MapView/MapView"

const ListingInfoForm = ({
    isUpdate = false,
    title,
    description,
    locationDescription,
    latLong,
    price,
    setTitle,
    initialMapLocation,
    setDescription,
    setLocationDescription,
    setLatLong,
    setPrice,
    isListingLoading,
    isDeleteLoading,
    error,
    onSubmit,
    onDelete = () => {}
}) => {
    const handleInputChange = (e) => {
        const textarea = e.target
        setTitle(textarea.value)
        textarea.style.height = "auto"
        // Set the height to the scrollHeight to expand as needed
        textarea.style.height = `${textarea.scrollHeight}px`
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        onSubmit()
    }

    return (
        <div className="listing-info">
            <form onSubmit={handleSubmit}>
                <textarea
                    type="text"
                    maxLength="50"
                    className="listing-title"
                    value={title}
                    placeholder="Property title"
                    onChange={(e) => {
                        handleInputChange(e)
                    }}
                />
                <h2 className="listing-form-section-header">Details</h2>
                <div className="listing-container price-container">
                    <EuroIcon className="listing-icon" />
                    <input
                        type="text"
                        className="listing-field"
                        value={price}
                        maxLength="13"
                        placeholder="Price"
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>

                <div className="listing-container">
                    <DescriptionIcon className="listing-icon" />
                    <textarea
                        type="text"
                        className="listing-field  listing-description"
                        value={description}
                        placeholder="Property description"
                        onChange={(e) => {
                            setDescription(e.target.value)
                        }}
                    />
                </div>

                <h2 className="listing-form-section-header">Location</h2>
                <div className="listing-container">
                    <LocationIcon className="listing-icon" />
                    <textarea
                        type="text"
                        className="listing-field  listing-location"
                        value={locationDescription}
                        placeholder="Property location"
                        onChange={(e) => {
                            setLocationDescription(e.target.value)
                        }}
                    />
                </div>

                <div className="map-container">
                    <MapView initialLocation={initialMapLocation} location={latLong} setLocation={setLatLong} topWidget="search" />
                </div>


                {error && <div className="error listing-error">{error}</div>}

                <div className="btn-container">
                    <SPCLoadingButton loading={isListingLoading} className="list-btn">
                        {isUpdate ? "Update listing!" : "List it!"}
                    </SPCLoadingButton>
                    <SPCLoadingButton
                        title="This feature is coming soon!"
                        buttonType="outlined"
                        disabled={true}
                        className="save-btn"
                    >
                        Save draft
                    </SPCLoadingButton>
                </div>
                {isUpdate && ( // TODO: move delete button outside the ListingInfoForm
                    <SPCLoadingButton
                        loading={isDeleteLoading}
                        tint="var(--error)"
                        className="delete-btn"
                        type="button"
                        onClick={onDelete}
                    >
                        Delete listing
                    </SPCLoadingButton>
                )}
            </form>
        </div>
    )
}

export default ListingInfoForm
