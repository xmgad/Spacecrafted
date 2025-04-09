import "./MapView.css"
import React, { useEffect, useState } from "react"
import {
    APIProvider,
    Map,
    MapCameraChangedEvent,
} from "@vis.gl/react-google-maps"
import { ReactComponent as PinIcon } from "../../../icons/Location.svg"
import { ReactComponent as DirectionsIcon } from "../../../icons/Directions.svg"
import { ReactComponent as SearchIcon } from "../../../icons/Search.svg"

import SPCButton from "../SPCButton/SPCButton"
import LocationSearch from "../LocationSearch/LocationSearch"

const getPlaceName = async (location) => {
    const { lat, lng } = location
    const apiKey = process.env.REACT_APP_MAPS_API_KEY
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`

    try {
        const response = await fetch(url)
        const data = await response.json()

        if (data.status === "OK") {
            const results = data.results
            if (results.length > 0) {
                return results[0].formatted_address
            } else {
                return "No results found"
            }
        } else {
            return "Geocoding API error: " + data.status
        }
    } catch (error) {
        console.error("Error fetching place name:", error)
        return "Error fetching place name"
    }
}

const getGoogleMapsUrl = (location) => {
    const { lat, lng } = location
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}

const MapTopWidget = ({ type, onInteraction }) => {
    switch (type) {
        case "directions":
            return (
                <SPCButton
                    className="map-directions-button"
                    tint="var(--purple)"
                    icon={DirectionsIcon}
                    isIconStroke={false}
                    onClick={onInteraction}
                >
                    Get directions
                </SPCButton>
            )
        case "search":
            return <LocationSearch onSelectLocation={onInteraction} fieldIcon={SearchIcon}/>
        default:
            return <div></div>
    }
}

const MapView = ({
    location,
    setLocation,
    isPreview,
    topWidget,
    className,
}) => {
    const [placeName, setPlaceName] = useState(null)
    const [isChanging, setIsChanging] = useState(false)

    useEffect(() => {
        if (!location || isChanging) return
        const updatePlaceName = async () => {
            const name = await getPlaceName(location)
            if (name) {
                setPlaceName(name)
            }
        }
        updatePlaceName()
    }, [location])

    const handleCameraStopped = async (event) => {
        if (isPreview) return
        const center = event.map.center
        const newLocation = { lat: center.lat(), lng: center.lng() }
        console.log("camera changed:", newLocation)
        setLocation(newLocation)
    }

    const handleCameraChange = (event) => {
        if (isPreview) return
        setLocation(event.detail.center)
    }
    // Top widget interactions
    const handleDirections = () => {
        const directionsUrl = getGoogleMapsUrl(location)
        window.open(directionsUrl, "_blank")
    }

    const handleSearchInteraction = (interaction) => {
        setLocation(interaction.coordinates)
    }

    const handleTopWidgetInteraction = (interaction) => {
        switch (topWidget) {
            case "directions":
                handleDirections()
                break
            case "search":
                handleSearchInteraction(interaction)
                break
            default:
                break
        }
    }

    const cName = `map-view ${className}`
    return (
        <div className={cName}>
            <APIProvider
                apiKey={process.env.REACT_APP_MAPS_API_KEY}
                onLoad={() => console.log("Maps API has loaded.")}
            >
                <Map
                    defaultZoom={16}
                    defaultCenter={{ lat: 48.137154, lng: 11.576124 }}
                    center={location}
                    gestureHandling={isPreview ? "none" : "greedy"}
                    onCameraChanged={handleCameraChange}
                    streetViewControl={false}
                    mapTypeControl={false}
                    clickableIcons={false}
                    fullscreenControl={!isPreview}
                    onIdle={handleCameraStopped}
                    onDragstart={() => setIsChanging(true)}
                    onDragend={() => setIsChanging(false)}
                ></Map>
            </APIProvider>
            <PinIcon className="map-pin" />
            <div
                style={{ opacity: isChanging ? 0.3 : 1 }}
                className="map-place-name"
            >
                <p>{placeName}</p>
            </div>

            {topWidget && (
                <div className="map-top-widget">
                    <MapTopWidget
                        type={topWidget}
                        onInteraction={handleTopWidgetInteraction}
                    />
                </div>
            )}
        </div>
    )
}

export default MapView
