import "./SearchBar.css"
import React from "react"
import SPCIconField from "../SPCIconField/SPCIconField"
import { ReactComponent as SearchIcon } from "../../../icons/Search.svg"

const SearchBar = ({
    searchTerm,
    onTermChange,
    className,
    fontSize = "16px",
    placeholder
}) => {
    const cName = `listing-search-bar ${className}`
    return (
        <div className={cName}>
            <SPCIconField
                icon={SearchIcon}
                value={searchTerm}
                onChange={(event) => onTermChange(event.target.value)}
                placeholder={placeholder}
                fontSize={fontSize}
            />
        </div>
    )
}

export default SearchBar
