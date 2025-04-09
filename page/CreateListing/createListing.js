import { useNavigate } from "react-router-dom"
import SPCDialog from "../../components/common/Dialogs/SPCDialog/SPCDialog.js"
import StagingDialog from "../../components/common/Dialogs/StagingDialog/StagingDialog.js"
import ListingInfoForm from "../../components/createListing/ListingInfoForm/ListingInfoForm"
import ListingUploadView from "../../components/createListing/ListingUploadView/ListingUploadView"
import { useCreateListing } from "../../hooks/Listings/useCreateListing"
import { useStage } from "../../hooks/Staging/useStage.js"
import "./createListing.css"
import React, { useState } from "react"

const CreateListing = () => {
    const navigate = useNavigate()
    // States
    const [images, setImages] = useState(Array(10).fill(null))
    const [title, setTitle] = useState(null)
    const [description, setDescription] = useState(null)
    const [locationDescription, setLocationDescription] = useState(null)
    const [latLong, setLatLong] = useState(null)
    const [price, setPrice] = useState(null)
    const [imageDeletionIndex, setImageDeletionIndex] = useState(-1)
    const [imageStagingIndex, setImageStagingIndex] = useState(-1)
    // Hooks
    const { createListing, isLoading, error } = useCreateListing()

    const submitListing = async () => {
        const numericPrice = parseInt(price.replace(/,/g, ""), 10)
        const location = { description: locationDescription, coordinates: latLong }
        const listing = await createListing(
            title,
            numericPrice,
            description,
            location,
            images
        )
        if (listing) navigate("/dashboard/listings", {replace: true})
    }

    const onDrop = (acceptedFiles, index) => {
        const newImages = [...images]
        newImages[index] = acceptedFiles[0]
        setImages(newImages)
    }

    const onImageDeleteClick = (index) => {
        setImageDeletionIndex(index)
    }

    const onImageDelete = (index) => {
        onDrop([null], index)
        setImageDeletionIndex(-1)
    }

    const onStageClick = (index) => {
        setImageStagingIndex(index)
    }

    const onConfirmStage = async (stagedImage, index) => {
        onDrop([stagedImage], index)
        setImageStagingIndex(-1)
    }

    const handlePriceChange = (value) => {
        // Remove non-numeric characters except the comma
        value = value.replace(/[^0-9]/g, "")

        // Format the number with commas
        const formattedPrice = new Intl.NumberFormat().format(value)

        setPrice(formattedPrice)
    }

    return (
        <div className="create-listing">
            <div className="create-header">
                <h1>Create a listing</h1>
            </div>
            <div className="create-listing-form">
                <ListingUploadView
                    images={images}
                    onDrop={onDrop}
                    onDelete={onImageDeleteClick}
                    onStage={onStageClick}
                />
                <ListingInfoForm
                    title={title}
                    description={description}
                    locationDescription={locationDescription}
                    latLong={latLong}
                    price={price}
                    setTitle={setTitle}
                    setDescription={setDescription}
                    setLocationDescription={setLocationDescription}
                    setLatLong={setLatLong}
                    setPrice={handlePriceChange}
                    isListingLoading={isLoading}
                    error={error}
                    onSubmit={submitListing}
                />
            </div>
            <SPCDialog
                isOpen={imageDeletionIndex > -1}
                title="Remove Image"
                message="Are you sure you want to remove this image?"
                confirmTitle="Remove"
                onRequestClose={() => setImageDeletionIndex(-1)}
                onConfirm={() => onImageDelete(imageDeletionIndex)}
                tint="var(--error)"
            />
            {imageStagingIndex > -1 && (
                <StagingDialog
                    isOpen={imageStagingIndex > -1}
                    image={images[imageStagingIndex]}
                    onCancel={() => setImageStagingIndex(-1)}
                    onConfirm={(stagedImage) => {
                        onConfirmStage(stagedImage, imageStagingIndex)
                    }}
                />
            )}
        </div>
    )
}

export default CreateListing
