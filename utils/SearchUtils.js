import { maxDistanceLimit } from "../Constants"
import { timeFilterValues } from "./DateUtils"

export const makeListingQuery = (
    term,
    location,
    locationMaxDistance,
    locationName,
    minPrice,
    maxPrice,
    time
) => {
    const provided = (param) => param != null && param.length > 0
    const numeric = (price) => parseInt(price.replace(/,/g, ""), 10)

    let params = {}
    if (provided(term)) params.term = term

    if (provided(location)) {
        params.location = location
        if (locationMaxDistance <= maxDistanceLimit)
            params.distance = locationMaxDistance
        if (provided(locationName)) params.location_name = locationName
    }

    if (provided(minPrice)) params.min_price = numeric(minPrice)
    if (provided(maxPrice)) params.max_price = numeric(maxPrice)

    if (time != null) params.date = timeFilterValues[time]

    const urlParams = new URLSearchParams(params)
    return `?${urlParams}`
}
