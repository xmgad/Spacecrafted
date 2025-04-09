import Notification from "../models/notificationModel.js"

const getMyNotifications = async (req, res) => {
    const userId = req.user._id
    try {
        const notifications = await Notification.find({
            receiverId: userId,
        }).sort({
            createdAt: -1,
        })

        res.status(200).json(notifications)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const seeAllNotifications = async (req, res) => {
    const userId = req.user._id
    try {
        const update = await Notification.updateMany(
            { receiverId: userId, isSeen: false },
            { isSeen: true, seenAt: new Date() }
        )
        res.status(200).json(update)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const newNotificationCount = async (req, res) => {
    const userId = req.user._id
    try {
        const count = await Notification.countDocuments({
            receiverId: userId,
            isSeen: false,
        })
        res.status(200).json({ count })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export { getMyNotifications, seeAllNotifications, newNotificationCount }
