export const formatPrice = (value) => {
    const numeric = value.replace(/[^0-9]/g, "")
    if (!numeric.length) return ""
    const formattedPrice = new Intl.NumberFormat().format(numeric)
    return formattedPrice
}