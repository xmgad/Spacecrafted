import React, { useState, useEffect } from "react"
import "./agentDashboard.css"
import UserInfoCard from "../../components/agentDashboard/userInfoCard/userInfoCard"
import { useAuthContext } from "../../hooks/useAuthContext"
import { ReactComponent as ListingIcon } from "../../icons/Listing.svg"
import { ReactComponent as NotificationIcon } from "../../icons/Notification.svg"
import { ReactComponent as FavIcon } from "../../icons/Favorite.svg"
import MyListingsContent from "../../components/agentDashboard/MyListingsContent/MyListingsContent"
import NotificationsContent from "../../components/agentDashboard/NotificationsContent/NotificationsContent"
import FavoritesContent from "../../components/agentDashboard/FavoritesContent/FavoritesContent"
import {
    Route,
    Routes,
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom"
import { useNavigateSingleTop } from "../../utils/NavigationUtils"

const dashboardTabs = ["listings", "notifications", "favorites"]

const AgentDashboard = () => {
    const params = useParams()
    const navigate = useNavigate()
    const { navigateSingleTop } = useNavigateSingleTop()
    const [selectedTab, setSelectedTab] = useState("")
    const [notificationCount, setNotificationCount] = useState(0)
    const [user, setUser] = useState(null)
    const { user: userEntry } = useAuthContext()

    useEffect(() => {
        const tab = params["*"]
        if (dashboardTabs.includes(tab)) {
            setSelectedTab(tab)
            return
        }
        navigate("/dashboard/listings", { replace: true })
    }, [params])

    // fetch user
    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch("http://localhost:4000/api/user/me", {
                headers: { Authorization: `Bearer ${userEntry.token}` },
            })
            const json = await response.json()

            if (response.ok) {
                setUser(json)
            }
        }

        const getNotificationCount = async () => {
            const response = await fetch("http://localhost:4000/api/notification/new-count", {
                headers: { Authorization: `Bearer ${userEntry.token}` },
            })
            const json = await response.json()

            if (response.ok) {
                setNotificationCount(json.count)
            }
        }

        if (userEntry) {
            fetchUser()
            getNotificationCount()
        }
    }, [userEntry])

    useEffect(() => {
        if (selectedTab === "notifications") {
            setNotificationCount(0)
        }
    }, [selectedTab])

    return (
        <div className="agent-dashboard">
            <aside className="dashboard-pane">
                {user && <UserInfoCard user={user} />}
                <div
                    onClick={() => navigateSingleTop("/dashboard/listings")}
                    className={`dashboard-tab-button ${
                        selectedTab === "listings" ? "selected" : ""
                    }`}
                >
                    <ListingIcon className="dashboard-tab-icon" />
                    <p>My listings</p>
                </div>

                <div
                    onClick={() => navigateSingleTop("/dashboard/notifications")}
                    className={`dashboard-tab-button ${
                        selectedTab === "notifications" ? "selected" : ""
                    }`}
                >
                    <NotificationIcon className="dashboard-tab-icon" />
                    <p>Notifications</p>
                    {notificationCount > 0 && (
                        <div className="notification-count">
                            {notificationCount > 9 ? "9+" : notificationCount}
                        </div>
                    )}
                </div>

                <div
                    onClick={() => navigateSingleTop("/dashboard/favorites")}
                    className={`dashboard-tab-button ${
                        selectedTab === "favorites" ? "selected" : ""
                    }`}
                >
                    <FavIcon className="dashboard-tab-icon" />
                    <p>Favorites</p>
                </div>
            </aside>
            <div className="dashboard-content">
                <Routes>
                    <Route path="/listings" element={<MyListingsContent />} />
                    <Route
                        path="/notifications"
                        element={<NotificationsContent />}
                    />
                    <Route path="/favorites" element={<FavoritesContent />} />
                </Routes>
            </div>
        </div>
    )
}

export default AgentDashboard
