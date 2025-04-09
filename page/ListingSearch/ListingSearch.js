import "./ListingSearch.css"
import backgroundVideo from "../../videos/backgroundVideo.mp4"
import React, { useState } from "react"
import SPCButton from "../../components/common/SPCButton/SPCButton"
import { useNavigate } from "react-router-dom"
import FiltersView from "../../components/common/FiltersView/FiltersView"
import SearchBar from "../../components/common/SearchBar/SearchBar"
import { maxDistanceLimit } from "../../Constants"
import { makeListingQuery } from "../../utils/SearchUtils"


const FilterButton = ({ isOpen, toggleOpen }) => {
    const cName = `search-filter-button ${isOpen ? "open" : ""}`
    return (
        <div onClick={toggleOpen} className={cName}>
            Filters
        </div>
    )
}

const ListingSearch = ({}) => {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState("")
    const [showFilters, setShowFilters] = useState(false)
    // Filters
    const [location, setLocation] = useState(null)
    const [locationMaxDistance, setLocationMaxDistance] = useState(10)
    const [minPrice, setMinPrice] = useState("")
    const [maxPrice, setMaxPrice] = useState("")
    const [time, setTime] = useState(null)

    const [locationName, setLocationName] = useState(null)

    const handleSearchConfirm = () => {
        const query = makeListingQuery(
            searchTerm,
            location,
            locationMaxDistance,
            locationName,
            minPrice,
            maxPrice,
            time
        )
        navigate(`/listings${query}`)
    }

    return (
        <div className="listing-search-page">
            <video className="listing-search-video" autoPlay loop muted>
                <source src={backgroundVideo} type="video/mp4" />
            </video>
            <div className="listing-search-content">
                <div className="search-title">Find Your Dream Home</div>
                <div className="search-subtitle">
                    Search among beautifully staged properties
                </div>
                <div className="listing-search-control-container">
                    <div className="search-filter-container">
                        <SearchBar
                            searchTerm={searchTerm}
                            onTermChange={setSearchTerm}
                            placeholder="Family house, luxurious loft, cozy cottage"
                        />
                        <FilterButton
                            isOpen={showFilters}
                            toggleOpen={() => setShowFilters(!showFilters)}
                        />
                    </div>
                    <FiltersView
                        location={location}
                        setLocation={setLocation}
                        setLocationName={setLocationName}
                        locationMaxDistance={locationMaxDistance}
                        setLocationMaxDistance={setLocationMaxDistance}
                        minPrice={minPrice}
                        setMinPrice={setMinPrice}
                        maxPrice={maxPrice}
                        setMaxPrice={setMaxPrice}
                        time={time}
                        setTime={setTime}
                        maxDistanceLimit={maxDistanceLimit}
                        className={`search-filters-view ${
                            showFilters ? "open" : ""
                        }`}
                    />
                    <SPCButton
                        onClick={handleSearchConfirm}
                        className="search-confirm-button"
                    >
                        View Listings
                    </SPCButton>
                </div>
            </div>
        </div>
    )
}

export default ListingSearch
