import { AuthContext } from "../context/AuthContext"
import { useContext } from "react"

export const defaultAuthRedirectionState = (user) => {
    const isAgent = user.userType === "Agent"
    return { redirect: isAgent ? "/dashboard" : "/search" }
}

export const useAuthContext = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw Error("useAuthContext must be used inside an AuthContextProvider")
    }

    return context
}
