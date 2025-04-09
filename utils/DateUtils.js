export const timeAgo = (date) => {
    const now = new Date()
    const secondsAgo = Math.floor((now - date) / 1000)

    const minutesAgo = Math.floor(secondsAgo / 60)
    const hoursAgo = Math.floor(minutesAgo / 60)
    const daysAgo = Math.floor(hoursAgo / 24)

    if (daysAgo > 0) {
        return `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`
    } else if (hoursAgo > 0) {
        return `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`
    } else if (minutesAgo > 0) {
        return `${minutesAgo} minute${minutesAgo > 1 ? "s" : ""} ago`
    } else {
        return "Just now"
    }
}

export const timeFilterValues = ["week", "month", "year"]
export const timeFilterDisplayValues = ["This week", "This month", "This year"]
