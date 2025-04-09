import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import ListingView from "../../components/common/ListingView/ListingView"
import "./ListingsPage.css"
import { useFetchListings } from "../../hooks/Listings/useFetchListings"
import FiltersView from "../../components/common/FiltersView/FiltersView"
import SearchBar from "../../components/common/SearchBar/SearchBar"
import { maxDistanceLimit } from "../../Constants"
import { timeFilterValues } from "../../utils/DateUtils"
import { formatPrice } from "../../utils/PriceUtils"
import SPCButton from "../../components/common/SPCButton/SPCButton"
import { makeListingQuery } from "../../utils/SearchUtils"
import { useAuthContext } from "../../hooks/useAuthContext"

const ListingsList = ({ listings, favs }) => {
    console.log('FAVS', favs);
    return (
        <ul className="listings-list">
            {listings.map((listing) => (
                <li key={listing._id} className="listing-item">
                    <ListingView
                        listing={listing}
                        isFav={favs.includes(listing._id)}
                    />
                </li>
            ))}
        </ul>
    )
}

const ListingsPage = () => {
    const pageLocation = useLocation()
    const searchQuery = pageLocation.search
    const { user } = useAuthContext()
    const navigate = useNavigate()

    const [listings, setListings] = useState([])
    const [favs, setFavs] = useState([])
    const { fetchListings, isLoading, error } = useFetchListings()
    const [queryChanged, setQueryChanged] = useState(false)
    // Filters
    const [searchTerm, setSearchTerm] = useState("")
    const [location, setLocation] = useState(null)
    const [locationMaxDistance, setLocationMaxDistance] = useState(10)
    const [minPrice, setMinPrice] = useState("")
    const [maxPrice, setMaxPrice] = useState("")
    const [time, setTime] = useState(null)
    const [locationName, setLocationName] = useState("")

    const makeUpdateQuery = () => {
        const query = makeListingQuery(
            searchTerm,
            location,
            locationMaxDistance,
            locationName,
            minPrice,
            maxPrice,
            time
        )
        return query
    }

    const handleRefreshClick = () => {
        const query = makeUpdateQuery()

        if (query === searchQuery) {
            console.log("Query did not change.")
            return
        }
        // console.log("old:", searchQuery, "new:", query)
        navigate(`/listings${query}`)
    }

    useEffect(() => {
        const updateQuery = makeUpdateQuery()
        setQueryChanged(updateQuery !== searchQuery)
    }, [searchTerm, location, locationMaxDistance, minPrice, maxPrice, time])

    useEffect(() => {
        const getListings = async () => {
            const listings = await fetchListings(searchQuery)
            if (listings) setListings(listings)
        }

        const fillSearchAndFilters = () => {
            const params = Object.fromEntries(new URLSearchParams(searchQuery))
            setSearchTerm(params.term)
            setLocation(params.location)
            setLocationMaxDistance(params.distance ?? 10)
            if (params.min_price) setMinPrice(formatPrice(params.min_price))
            if (params.max_price) setMaxPrice(formatPrice(params.max_price))
            if (params.date) {
                const index = timeFilterValues.indexOf(params.date)
                setTime(index)
            }
            if (params.location_name) setLocationName(params.location_name)
        }

        getListings()
        fillSearchAndFilters()
    }, [searchQuery])

    useEffect(() => {
        const fetchFavs = async () => {
            console.log('FETCHING FAVS');
            const response = await fetch("http://localhost:4000/api/user/me/favorites", {
                headers: { Authorization: `Bearer ${user.token}` },
            })
            const json = await response.json()
            if (response.ok) {
                setFavs(json.favorites)
            }
        }
        if (user) fetchFavs()
    }, [user])

    return (
        <div className="listings-page">
            <aside className="listings-side-pane">
                <div className="search-filters-side">
                    <h2 className="listings-side-header">Search & Filters</h2>
                    <SearchBar
                        searchTerm={searchTerm}
                        onTermChange={setSearchTerm}
                        fontSize="14px"
                        placeholder="search keywords"
                        className="listings-page-search"
                    />
                    <FiltersView
                        className="listings-page-filters"
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
                        locationInitialValue={locationName}
                    />

                    <SPCButton
                        onClick={handleRefreshClick}
                        className={`refresh-listings-btn ${
                            queryChanged ? "" : "hidden"
                        }`}
                    >
                        Refresh listings
                    </SPCButton>
                </div>
            </aside>
            <div className="listings-container">
                <div className="listings-header">
                    <h1>Listings</h1>
                </div>
                <div className="listings-content">
                    {error && <div className="error">{error}</div>}
                    {listings.length === 0 ? (
                        <div>No listings available.</div>
                    ) : (
                        <ListingsList listings={listings} favs={favs} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ListingsPage
