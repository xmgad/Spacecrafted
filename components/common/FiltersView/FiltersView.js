import LocationSearch from "../LocationSearch/LocationSearch"
import "./FiltersView.css"
import React, { useState } from "react"
import { ReactComponent as LocationIcon } from "../../../icons/Location.svg"
import Slider from "@mui/material/Slider"
import SPCIconField from "../SPCIconField/SPCIconField"
import MultiOptionView from "../MultiOptionView/MultiOptionView"
import { timeFilterDisplayValues } from "../../../utils/DateUtils"
import { formatPrice } from "../../../utils/PriceUtils"

const FilterSection = ({ title, children }) => {
    return (
        <div className="filter-section">
            <p className="filter-section-title">{title}</p>
            {children}
        </div>
    )
}

const LocationMaxDistanceFilter = ({ distance, setDistance, maxDistance }) => {
    const handleChange = (event) => {
        const value = event.target.value
        console.log(value)
        setDistance(value)
    }

    return (
        <div className="max-distance-slider-container">
            <p className="in-distance-label">In distance</p>
            <div className="slider-container">
                <Slider
                    value={distance}
                    onChange={handleChange}
                    aria-labelledby="input-slider"
                    min={1}
                    max={maxDistance + 1}
                    sx={{
                        "& .MuiSlider-thumb": {
                            backgroundColor: "var(--secondary)",
                        },
                        "& .MuiSlider-track": {
                            backgroundColor: "var(--secondary)",
                            height: 8,
                            border: "none",
                        },
                        "& .MuiSlider-rail": {
                            backgroundColor: "#D3D3D3",
                            height: 8,
                            border: "none",
                        },
                    }}
                />
            </div>
            <p className="distance-value">
                {distance > maxDistance ? "any" : `${distance} km`}
            </p>
        </div>
    )
}

const PriceFilter = ({ minPrice, maxPrice, setMinPrice, setMaxPrice }) => {
    const handleMinPriceChange = (event) => {
        const value = formatPrice(event.target.value)
        setMinPrice(value)
    }

    const handleMaxPriceChange = (event) => {
        const value = formatPrice(event.target.value)
        setMaxPrice(value)
    }

    return (
        <div className="price-filter">
            <SPCIconField
                value={minPrice}
                onChange={handleMinPriceChange}
                placeholder="Min"
                maxLength="13"
                className="price-filter-field"
            />
            <p>-</p>
            <SPCIconField
                value={maxPrice}
                onChange={handleMaxPriceChange}
                placeholder="Max"
                maxLength="13"
                className="price-filter-field"
            />
            <p>€</p>
        </div>
    )
}

const TimeFilter = ({ selectedTime, setSelectedTime }) => {
    return (
        <div className="time-filter">
            <MultiOptionView
                options={timeFilterDisplayValues}
                selected={selectedTime}
                setSelected={setSelectedTime}
            />
        </div>
    )
}

const FiltersView = ({
    location,
    locationMaxDistance,
    minPrice,
    maxPrice,
    time,
    setLocation,
    setLocationMaxDistance,
    setLocationName,
    setMinPrice,
    setMaxPrice,
    setTime,
    maxDistanceLimit,
    locationInitialValue="",
    className,
}) => {
    const cName = `filters-view ${className}`

    const handleLocationFilter = (location) => {
        let locationString = null
        let locationName = ''
        if (location) {
            const { lat, lng } = location.coordinates
            locationString = `${lng},${lat}`
            locationName = location.name
        }
        setLocation(locationString)
        if (setLocationName) setLocationName(locationName)
    }

    return (
        <div className={cName}>
            {/* Location filter */}
            <FilterSection title="Location">
                <LocationSearch
                    onSelectLocation={handleLocationFilter}
                    fieldIcon={LocationIcon}
                    isIconStroke={false}
                    onClearClick={() => handleLocationFilter(null)}
                    initialValue={locationInitialValue}
                />
                {location && (
                    <LocationMaxDistanceFilter
                        maxDistance={maxDistanceLimit}
                        distance={locationMaxDistance}
                        setDistance={setLocationMaxDistance}
                    />
                )}
            </FilterSection>
            {/* Price filter */}
            <FilterSection title="Price">
                <PriceFilter
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    setMinPrice={setMinPrice}
                    setMaxPrice={setMaxPrice}
                />
            </FilterSection>
            {/* Time filter */}
            <FilterSection title="Time listed">
                <TimeFilter selectedTime={time} setSelectedTime={setTime} />
            </FilterSection>
        </div>
    )
}

export default FiltersView
