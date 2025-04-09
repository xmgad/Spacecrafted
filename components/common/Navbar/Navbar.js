import React, { useState } from "react"
import { Link } from "react-router-dom"
import "./Navbar.css"
import { ReactComponent as PersonIcon } from "../../../icons/Person.svg"
import { ReactComponent as DashboardIcon } from "../../../icons/Dashboard.svg"
import { ReactComponent as ChatIcon } from "../../../icons/Chat.svg"
import { ReactComponent as FavoriteIcon } from "../../../icons/Favorite.svg"
import { ReactComponent as LogoutIcon } from "../../../icons/Logout.svg"
import { ReactComponent as LoginIcon } from "../../../icons/Login.svg"
import { ReactComponent as CreateIcon } from "../../../icons/Create.svg"
import { useAuthContext } from "../../../hooks/useAuthContext"
import { useLogout } from "../../../hooks/useLogout"
import SPCButton from "../../common/SPCButton/SPCButton"
import { useNavigateSingleTop } from "../../../utils/NavigationUtils"

const AgentMenuItems = () => {
    const { navigateSingleTop } = useNavigateSingleTop()
    return (
        <div>
            <div
                onClick={() => navigateSingleTop("/create-listing")}
                className="menu-item"
            >
                <CreateIcon className="menu-item-icon" />
                <p>Create listing</p>
            </div>
            <div
                onClick={() => navigateSingleTop("/dashboard")}
                className="menu-item"
            >
                <DashboardIcon className="menu-item-icon stroke" />
                <p>Dashboard</p>
            </div>
            <div
                onClick={() => navigateSingleTop("/conversations")}
                className="menu-item"
            >
                <ChatIcon className="menu-item-icon stroke" />
                <p>Conversations</p>
            </div>
        </div>
    )
}

const BuyerMenuItems = () => {
    const { navigateSingleTop } = useNavigateSingleTop()
    return (
        <div>
            <div
                onClick={() => navigateSingleTop("/favorites")}
                className="menu-item"
            >
                <FavoriteIcon className="menu-item-icon" />
                <p>Favorites</p>
            </div>
            <div
                onClick={() => navigateSingleTop("/conversations")}
                className="menu-item"
            >
                <ChatIcon className="menu-item-icon stroke" />
                <p>Conversations</p>
            </div>
        </div>
    )
}

const UserMenu = ({ user }) => {
    const isAgent = user.userType === "Agent"
    const [isOpen, setIsOpen] = useState(false)

    const { logout } = useLogout()
    return (
        <div
            className="user-menu-container"
            onMouseOver={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <div className="user-menu-button">
                <PersonIcon className="user-menu-button-icon" />
                <div>{user.name}</div>
            </div>
            <div className="menu-gap" />
            <div className={`user-menu-dropdown ${!isOpen ? "hidden" : ""}`}>
                {isAgent ? <AgentMenuItems /> : <BuyerMenuItems />}
                <div onClick={logout} className="menu-item logout">
                    <LogoutIcon className="menu-item-icon" />
                    <p>Logout</p>
                </div>
            </div>
        </div>
    )
}

const Navbar = () => {
    const { user } = useAuthContext()
    const { navigateSingleTop } = useNavigateSingleTop()
    return (
        <header>
            <div className="container">
                <Link to="/" className="logo">
                    Spacecrafted
                </Link>
                <nav className="nav">
                    <Link className="navbar-link" to="/subscription">
                        Pricing
                    </Link>
                    <Link className="navbar-link" to="/about">
                        About us
                    </Link>
                </nav>

                {user && <UserMenu user={user} />}
                {!user && (
                    <div className="login-container">
                        <SPCButton
                            buttonType="default_light"
                            isIconStroke={false}
                            icon={LoginIcon}
                            iconPosition="right"
                            onClick={() => navigateSingleTop("/login")}
                        >
                            Sign in
                        </SPCButton>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Navbar
