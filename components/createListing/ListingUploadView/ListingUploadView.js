import React from "react"
import "./ListingUploadView.css"
import Dropzone from "../Dropzone/Dropzone"
import { ReactComponent as PlusIcon } from "../../../icons/Plus.svg"
import { ReactComponent as DeleteIcon } from "../../../icons/Delete.svg"
import { ReactComponent as StageIcon } from "../../../icons/Stage.svg"
import { useStage } from "../../../hooks/Staging/useStage"

const ListingUploadView = ({
    images,
    onDrop,
    onDelete,
    onStage,
}) => {

    return (
        <div className="listing-upload">
            <SPCDropZone
                image={images[0]}
                index={0}
                onDrop={onDrop}
                onDelete={onDelete}
                onStage={onStage}
                className="cover-image"
            />
            <div className="other-images">
                {images.slice(1).map((image, index) => (
                    <SPCDropZone
                        image={image}
                        index={index + 1}
                        onDrop={onDrop}
                        onDelete={onDelete}
                        onStage={onStage}
                    />
                ))}
            </div>
        </div>
    )
}

const SPCDropZone = ({
    image,
    index,
    onDrop,
    onDelete,
    onStage,
    className,
}) => {
    const handleDelete = (e) => {
        e.stopPropagation()
        onDelete(index)
    }

    const handleStage = (e) => {
        e.stopPropagation()
        onStage(index)
    }

    const url = image
        ? image.url
            ? image.url
            : URL.createObjectURL(image)
        : null
    return (
        <Dropzone key={index} index={index} onDrop={onDrop}>
            {image ? (
                <div className="list-upload-preview-container">
                    <img
                        src={url}
                        alt={`Preview ${index}`}
                        className={`listing-upload-preview ${className}`}
                    />
                    <div
                        className={`listing-image-options ${
                            className !== "cover-image" ? "small" : ""
                        }`}
                    >
                        <StageIcon
                            onClick={handleStage}
                            title="Stage it!"
                            style={{ fill: "var(--dark-purple)" }}
                            className={`listing-image-delete-icon ${
                                className !== "cover-image" ? "small" : ""
                            }`}
                        />

                        <DeleteIcon
                            onClick={handleDelete}
                            style={{ stroke: "var(--error)" }}
                            className={`listing-image-delete-icon ${
                                className !== "cover-image" ? "small" : ""
                            }`}
                        />
                    </div>
                </div>
            ) : (
                <div className={`upload-placeholder ${className}`}>
                    {" "}
                    <PlusIcon className="add-icon" />{" "}
                </div>
            )}
        </Dropzone>
    )
}

export default ListingUploadView
