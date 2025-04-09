import React, { useState } from "react"
import { ReactComponent as DescriptionIcon } from "../../icons/Description.svg"
import { ReactComponent as LocationIcon } from "../../icons/Location.svg"
import { ReactComponent as EuroIcon } from "../../icons/Euro.svg"
import { ReactComponent as ChatIcon } from "../../icons/Chat.svg"
import { ReactComponent as EditIcon } from "../../icons/Edit.svg"
import "./ListingDetailInfo.css"
import SPCButton from "../common/SPCButton/SPCButton"
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "../../hooks/useAuthContext"
import StartChatDialog from "../common/Dialogs/StartChatDialog/StartChatDialog"
import { useGetExistingConversation } from "../../hooks/Conversations/useGetExistingConversation"
import SPCLoadingButton from "../common/SPCLoadingButton/SPCLoadingButton"
import RegisterDialog from "../common/Dialogs/RegisterDialog/RegisterDialog"
const ListingDetailInfo = ({ listing }) => {
    const [showChatDialog, setShowChatDialog] = useState(false)
    const [showRegisterDialog, setShowRegisterDialog] = useState(false)
    const { title, description, price } = listing
    const location = listing.location.description
    const navigate = useNavigate()
    const { user } = useAuthContext()
    const { getExistingConversation, isLoading, error } =
        useGetExistingConversation()

    const isMine = user && user.id === listing.userId

    const handleChatClick = async () => {
        const onExistingConversation = (conversation) => {
            navigate(`/conversations/${conversation._id}`)
        }

        const onCreateNewConversation = () => {
            setShowChatDialog(true)
        }

        if (!user) {
            setShowRegisterDialog(true)
            return
        }
        await getExistingConversation(
            listing._id,
            onExistingConversation,
            onCreateNewConversation,
            user.token
        )
    }

    const handleCreatedConversation = (conv) => {
        setShowChatDialog(false)
        navigate(`/conversations/${conv._id}`)
    }

    return (
        <div className="detail-info">
            <h2 className="detail-info-title">{title}</h2>
            <div className="detail-info-field detail-price">
                <EuroIcon className="detail-icon" />
                <p>{price.toLocaleString()}</p>
            </div>
            <div className="detail-info-field">
                <DescriptionIcon className="detail-icon" />
                <p>{description}</p>
            </div>
            <div className="detail-info-field">
                <LocationIcon className="detail-icon" />
                <p>{location}</p>
            </div>
            <div>
                {!isMine && (
                    <SPCLoadingButton
                        icon={ChatIcon}
                        loading={isLoading}
                        className="detail-info-button"
                        buttonType="default_light"
                        onClick={handleChatClick}
                    >
                        Message owner
                    </SPCLoadingButton>
                )}

                {isMine && (
                    <SPCButton
                        onClick={() =>
                            navigate(`/update-listing/${listing._id}`)
                        }
                        icon={EditIcon}
                        isIconStroke={false}
                        className="detail-info-button"
                        buttonType="default_light"
                    >
                        Edit listing
                    </SPCButton>
                )}

                {error && <div className="error">{error}</div>}
                <StartChatDialog
                    isOpen={showChatDialog}
                    listing={listing}
                    onCancel={() => setShowChatDialog(false)}
                    onCreated={handleCreatedConversation}
                />
            </div>
            <RegisterDialog
                isOpen={showRegisterDialog}
                onRequestClose={() => setShowRegisterDialog(false)}
            ></RegisterDialog>
        </div>
    )
}

export default ListingDetailInfo
