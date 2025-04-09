import ListingInfoForm from "../../components/createListing/ListingInfoForm/ListingInfoForm"
import ListingUploadView from "../../components/createListing/ListingUploadView/ListingUploadView"
import "../CreateListing/createListing.css"
import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useUpdateListing } from "../../hooks/Listings/useUpdateListing"
import SPCDialog from "../../components/common/Dialogs/SPCDialog/SPCDialog"
import { useDeleteListing } from "../../hooks/Listings/useDeleteListing"
import { useStage } from "../../hooks/Staging/useStage.js"
import StagingDialog from "../../components/common/Dialogs/StagingDialog/StagingDialog.js"

const UpdateListing = () => {
    const navigate = useNavigate()
    const { listingId: updateListingId } = useParams()
    // states
    const [images, setImages] = useState(Array(10).fill(null))
    const [title, setTitle] = useState(null)
    const [description, setDescription] = useState(null)
    const [locationDescription, setLocationDescription] = useState(null)
    const [latLong, setLatLong] = useState(null)
    const [price, setPrice] = useState(null)
    const [removeKeys, setRemoveKeys] = useState([])
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [imageDeletionIndex, setImageDeletionIndex] = useState(-1)
    const [imageStagingIndex, setImageStagingIndex] = useState(-1)
    // hooks
    const {
        updateListing,
        isLoading: isUpdateLoading,
        error: updateError,
    } = useUpdateListing()
    const {
        deleteListing,
        isLoading: isDeleteLoading,
        error: deleteError,
    } = useDeleteListing()
    const { stageImage, _isLoading, _error } = useStage()

    const handlePriceChange = (value) => {
        // Remove non-numeric characters except the comma
        value = value.replace(/[^0-9]/g, "")

        // Format the number with commas
        const formattedPrice = new Intl.NumberFormat().format(value)

        setPrice(formattedPrice)
    }

    const removeKey = (key) => {
        const rmKeys = [...removeKeys]
        rmKeys.push(key)
        setRemoveKeys(rmKeys)
    }

    const submitListing = async () => {
        const numericPrice = parseInt(price.replace(/,/g, ""), 10)
        const location = {
            description: locationDescription,
            coordinates: latLong,
        }
        await updateListing(
            updateListingId,
            title,
            numericPrice,
            description,
            location,
            images,
            removeKeys,
            () => navigate(-1)
        )
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
        const img = images[index]
        if (img.key) {
            removeKey(img.key)
        }
        onDrop([null], index)
        setImageDeletionIndex(-1)
    }

    const onStageClick = (index) => {
        setImageStagingIndex(index)
    }

    const onConfirmStage = async (stagedImage, index) => {
        onImageDelete(index)
        onDrop([stagedImage], index)
        setImageStagingIndex(-1)
    }

    if (!updateListingId) {
        console.error("Missing listing ID for update")
        // TODO: navigate back
    }

    useEffect(() => {
        if (!updateListingId) return
        const fetchListing = async (id) => {
            try {
                const response = await fetch(`http://localhost:4000/api/listing/${id}`, {
                    headers: { "Content-Type": "application/json" },
                })
                const listing = await response.json()
                if (response.ok) {
                    setTitle(listing.title)
                    setDescription(listing.description)
                    setLocationDescription(listing.location.description)
                    // set coordinates
                    const listingCoordinates = listing.location.coordinates
                    const [lng, lat] = listingCoordinates.longlat
                    setLatLong({ lng, lat })

                    handlePriceChange(listing.price.toString())
                    // set existing images
                    var existingImages = [...images]
                    listing.images.forEach((image, index) => {
                        existingImages[index] = image
                    })
                    setImages(existingImages)
                } else {
                    throw new Error("Could not fetch listing for update")
                }
            } catch (error) {
                console.error(error.message)
            }
        }

        fetchListing(updateListingId)
    }, [updateListingId])

    // Handling deletion
    const onDeleteClick = () => {
        setShowDeleteDialog(true)
    }
    const onDelete = async () => {
        setShowDeleteDialog(false)
        await deleteListing(updateListingId, () => navigate(-1))
    }

    return (
        <div className="create-listing">
            <div className="create-header">
                <h1>Update listing</h1>
            </div>
            <div className="create-listing-form">
                <ListingUploadView
                    images={images}
                    onDrop={onDrop}
                    onDelete={onImageDeleteClick}
                    onStage={onStageClick}
                />
                <ListingInfoForm
                    isUpdate={true}
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
                    isLoading={isUpdateLoading}
                    isDeleteLoading={isDeleteLoading}
                    error={updateError || deleteError}
                    onSubmit={submitListing}
                    onDelete={onDeleteClick}
                />
            </div>
            <SPCDialog
                isOpen={showDeleteDialog}
                title="Delete Listing"
                message="Are you sure you want to delete this listing?"
                confirmTitle="Delete"
                onRequestClose={() => setShowDeleteDialog(false)}
                onConfirm={onDelete}
                tint="var(--error)"
            />
            <SPCDialog
                isOpen={imageDeletionIndex > -1}
                title="Remove Image"
                message="Are you sure you want to remove this image?"
                confirmTitle="Remove"
                onRequestClose={() => setImageDeletionIndex(-1)}
                onConfirm={() => {
                    onImageDelete(imageDeletionIndex)
                }}
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

export default UpdateListing
