import React from "react"
import "./userInfoCard.css"
import pfpPlaceholder from "../../../images/pfp_placeholder.png"
import { ReactComponent as PhoneIcon } from "../../../icons/Phone.svg"
import { ReactComponent as MailIcon } from "../../../icons/Mail.svg"

const UserInfoCard = ({ user }) => {
    const pfp = /*user.pfp_url ? user.pfp_url :*/ pfpPlaceholder
    return (
        <div className="info-card">
            <div className="card-header">
                <img src={pfp} alt="profile picture" className="info-pfp" />
                <div className="card-name-title">
                    <p className="card-username">{user.name}</p>
                    <p className="card-title">
                        Real estate agent at Spacecrafted
                    </p>
                </div>
            </div>
            <div className="card-section">
                <strong>About</strong>
                <p>
                    {" "}
                    Extensive experience in the real estate field bla bla about
                    the agent
                </p>
            </div>
            <div className="card-section">
                <strong className="">Contact</strong>
                <div className="contact-section">
                    <PhoneIcon className="contact-icon"/>
                    <p>+49 157 3320 5170</p>
                </div>
                <div className="contact-section">
                    <MailIcon className="contact-icon"/>
                    <p>w.baroudi@tum.de</p>
                </div>
            </div>
        </div>
    )
}

export default UserInfoCard
