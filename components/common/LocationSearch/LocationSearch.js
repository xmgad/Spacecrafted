import "./LocationSearch.css"
import React, { useEffect, useRef, useState } from "react"
import { ReactComponent as LocationIcon } from "../../../icons/Location.svg"
import { ReactComponent as ClearIcon } from "../../../icons/Cancel.svg"
import { ClipLoader } from "react-spinners"
import SPCIconField from "../SPCIconField/SPCIconField"

const ResultItem = ({ result, onClick }) => {
    return (
        <div onClick={() => onClick(result)} className="result-item">
            <LocationIcon className="location-item-icon" />
            <p>{result.description}</p>
        </div>
    )
}

const ResultsList = ({ results, error, onResultClick }) => {
    if (error) return <div className="location-search-error">{error}</div>

    return (
        <div className="results-container" style={{ opacity: results ? 1 : 0 }}>
            {results ? (
                results.length ? (
                    results.map((result) => (
                        <ResultItem result={result} onClick={onResultClick} />
                    ))
                ) : (
                    <div className="empty-results">No results found</div>
                )
            ) : (
                <div></div>
            )}
        </div>
    )
}

const LocationSearch = ({
    onSelectLocation,
    initialValue = "",
    fieldIcon: Icon,
    isIconStroke = true,
    onClearClick,
    className,
}) => {
    // states
    const [input, setInput] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState(null)
    // refs
    const searchDebounceRef = useRef(null)

    const cName = `location-search ${className}`

    useEffect(() => {
        setInput(initialValue)
    }, [initialValue])

    useEffect(() => {
        setResults(null)
        setError(null)
        setLoading(false)
        if (input.length < 3) return
        if (!isEditing) return
        const performSearch = async (input) => {
            const url = `http://localhost:4000/api/location/search?term=${encodeURIComponent(input)}`
            const response = await fetch(url)
            const data = await response.json()
            setLoading(false)
            if (!response.ok) {
                console.error(`Failed to fetch results - ${data.message}`)
                setError("Failed to fetch results")
                return
            }
            // got results
            setResults(data)
        }

        if (searchDebounceRef.current) {
            // clear previous debounce timer
            clearTimeout(searchDebounceRef.current)
        }
        setLoading(true)
        searchDebounceRef.current = setTimeout(() => {
            performSearch(input)
        }, 1000)

        return () => {
            if (searchDebounceRef.current) {
                clearTimeout(searchDebounceRef.current)
            }
        }
    }, [input, isEditing])

    const getLocationCoordinates = async (location) => {
        setLoading(true)
        const id = location.id
        const url = `http://localhost:4000/api/location/coordinates/${id}`
        const response = await fetch(url)
        const data = await response.json()
        setLoading(false)
        if (!response.ok) {
            console.error(`Failed to select location - ${data.message}`)
            setError("Failed to select location")
            return
        }
        // got result
        onSelectLocation({ coordinates: data, name: location.description })
    }

    const handleInputChange = (event) => {
        const value = event.target.value
        setInput(value)
    }

    const handleFocus = () => {
        setIsEditing(true)
    }

    const handleBlur = () => {
        setTimeout(() => {
            setIsEditing(false)
        }, 150) // Delay in milliseconds
    }

    const handleResultClick = async (result) => {
        console.log("clicked:", result)
        setIsEditing(false)
        setInput(result.description)
        await getLocationCoordinates(result)
    }

    const handleClearClick = () => {
        setInput("")
        if (onClearClick) onClearClick()
    }

    return (
        <div className={cName}>
            <div className="location-search-input-container">
                <SPCIconField
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Search city, street, etc."
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    icon={Icon}
                    isIconStroke={isIconStroke}
                    className="location-search-field"
                />
                <div className="location-search-end-container">
                    {loading && <ClipLoader color="var(--primary)" size={24} />}
                    {!loading && input.length > 0 && (
                        <ClearIcon
                            className="location-search-clear"
                            onClick={handleClearClick}
                        />
                    )}
                </div>
            </div>
            {isEditing && (
                <ResultsList
                    results={results}
                    onResultClick={handleResultClick}
                    error={error}
                />
            )}
        </div>
    )
}

export default LocationSearch
