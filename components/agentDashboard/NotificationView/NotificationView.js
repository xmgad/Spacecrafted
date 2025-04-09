import React from "react"
import { ReactComponent as FavoriteIcon } from "../../../icons/Favorite.svg"
import { ReactComponent as ChatIcon } from "../../../icons/Chat.svg"
import { ReactComponent as NotifIcon } from "../../../icons/Notification.svg"
import "./NotificationView.css"

const NotificationIcon = ({ type, className }) => {
    const cName = `notif-icon ${className}`
    switch (type) {
        case "favorite":
            return <FavoriteIcon className={`${cName} favorite`} />
        case "message":
            return <ChatIcon className={`${cName} message`} />
        default:
            return <NotifIcon className={cName} />
    }
}

const NotificationImage = ({ url, type }) => {
    return (
        <div className="notif-image-container">
            <img className="notif-image" src={url} alt="Notification preview" />
            <NotificationIcon type={type} className="badge" />
        </div>
    )
}

const NotificationView = ({ notification, onclick }) => {
    // TODO: pass notification model instead
    const imageUrl = notification.imageUrl
    return (
        <div
            onClick={() => onclick(notification.type, notification.actionId)}
            className={`notification-view ${notification.isSeen ? "seen" : ""}`}
        >
            {imageUrl ? (
                <NotificationImage url={imageUrl} type={notification.type} />
            ) : (
                <NotificationIcon type={notification.type} />
            )}

            <div className="notif-details">
                <p className="notif-title">{notification.title}</p>
                <p className="notif-description">{notification.message}</p>
            </div>
        </div>
    )
}

export default NotificationView
