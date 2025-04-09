import { Navigate } from "react-router-dom"
import { useAuthContext } from "../../hooks/useAuthContext"
import { isAgent } from "../../utils/UserUtils"
import "./FavoritesPage.css"
import React from "react"
import FavoritesContent from "../../components/agentDashboard/FavoritesContent/FavoritesContent"

const FavoritesPage = () => {
    const { user } = useAuthContext()
    if (isAgent(user))
        return <Navigate to="/dashboard/favorites" replace={true} />

    return (
        <div className="favorites-page">
            <div className="favorites-container">
                <FavoritesContent />
            </div>
        </div>
    )
}

export default FavoritesPage
