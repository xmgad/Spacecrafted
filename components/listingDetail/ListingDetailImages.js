import React, { useState } from "react";
import "./ListingDetailImages.css";


const ListingDetailImages = ({ images }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex + 1) % images.length
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex - 1 + images.length) % images.length
        );
    };


    return (
        <div className="listing-detail-images">
            <div className="image-container">
                <img
                    src={images[currentImageIndex].url}
                    alt={`Listing ${currentImageIndex + 1}`}
                    className="main-image"
                />
                {images.length > 1 && (
                    <>

                        <div className="image-counter">
                            {currentImageIndex + 1} / {images.length}
                        </div>
                    </>
                )}
            </div>
            {images.length > 1 && (
                <div className="thumbnail-container">
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image.url}
                            alt={`Thumbnail ${index + 1}`}
                            className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                            onClick={() => setCurrentImageIndex(index)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ListingDetailImages;