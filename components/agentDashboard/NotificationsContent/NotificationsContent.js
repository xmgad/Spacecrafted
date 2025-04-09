import React, { useEffect, useState } from "react"
import "./NotificationsContent.css"
import { ReactComponent as NotificationIcon } from "../../../icons/Notification.svg"
import NotificationView from "../NotificationView/NotificationView"
import { useNotification } from "../../../hooks/Notification/useNotification"
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "../../../hooks/useAuthContext"

const NotificationList = ({ notifications, onNotifClick }) => {
    if (notifications.length) {
        return notifications.map((notification) => (
            <NotificationView
                notification={notification}
                onclick={onNotifClick}
            />
        ))
    }

    return (
        <div className="no-notifications">
            <p>You do not have any notifications yet</p>
        </div>
    )
}

const NotificationsContent = () => {
    const [notifications, setNotifications] = useState(null)
    const { getMyNotifications, isLoading, error } = useNotification()
    const { user } = useAuthContext()
    const navigate = useNavigate()

    useEffect(() => {
        const markNotificationsSeen = async () => {
            const response = await fetch("http://localhost:4000/api/notification/see-all", {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })

            const json = await response.json()
            if (!response.ok) {
                console.error(json.message)
            }
        }

        const fetchNotifications = async () => {
            const notifications = await getMyNotifications()
            if (notifications) {
                setNotifications(notifications)
                await markNotificationsSeen()
            }
        }

        fetchNotifications()
    }, [])

    const handleClick = (type, actionId) => {
        switch (type) {
            case "favorite":
                return navigate(`/listing/${actionId}`)
            case "message":
                return navigate(`/conversations/${actionId}`)
            default: // TODO: handle other types
                console.log("NOTIF CLICK:", type, "-", actionId)
        }
    }

    return (
        <div className="dashboard-content-container">
            <div className="dashboard-tab-header">
                <NotificationIcon className="dashboard-tab-header-icon" />
                <p className="gradient-text">Notifications</p>
            </div>
            <div className="notifications-content">
                {error && <div className="error">{error}</div>}
                {notifications && (
                    <NotificationList
                        notifications={notifications}
                        onNotifClick={handleClick}
                    />
                )}
            </div>
        </div>
    )
}

export default NotificationsContent
