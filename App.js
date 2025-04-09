import React, { useEffect, useState } from "react"
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom"

// pages & components
import Home from "./page/Homepage/home"
import SignIn from "./page/Sign-In/sign-in"
import Registration from "./page/Registration/registration"
import About from "./page/About/about"
import Navbar from "./components/common/Navbar/Navbar"
import CreateListing from "./page/CreateListing/createListing"
import RecoveryPage from "./page/Recovery/RecoveryPage"
import ForgotPasswordPage from "./page/ForgotPassword/ForgotPasswordPage"
import AgentDashboard from "./page/AgentDashboard/agentDashboard"
import ListingsPage from "./page/Listings/ListingsPage"
import ListingDetailPage from "./page/ListingDetails/ListingDetailPage"
import UpdateListing from "./page/UpdateListing/updateListing"
import { useAuthContext } from "./hooks/useAuthContext"
import Conversations from "./page/Conversations/ConversationsPage"
//import SubscriptionSelectionPage from "./page/Subscription/SubscriptionPage"
import SubscriptionManager from "./components/Subscription/Subscriptioncomponent"
import SubscriptionPage from "./page/Subscription/SubscriptionPage"
import ListingSearch from "./page/ListingSearch/ListingSearch"
import CheckoutSuccess from "./page/Payment/CheckoutSuccess.js"
import FavoritesPage from "./page/FavoritesPage/FavoritesPage"

const UserProtectedElement = ({ element: Element, user, requiredUserType }) => {
    const location = useLocation()

    if (user) {
        if (requiredUserType) {
            if (requiredUserType === user.userType) {
                return <Element />
            }
            return <Navigate to="/" replace={true} />
        }
        return <Element />
    }

    return (
        <Navigate
            to="/login"
            state={{ redirect: location.pathname }}
            replace={true}
        />
    )
}

function App() {
    const { user } = useAuthContext()
    return (
        <div className="App">
            <BrowserRouter>
                <Navbar />
                <div className="pages">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<SignIn />} />
                        <Route path="/register" element={<Registration />} />
                        <Route path="/about" element={<About />} />
                        <Route
                            path="/create-listing"
                            element={
                                <UserProtectedElement
                                    element={CreateListing}
                                    user={user}
                                    requiredUserType="Agent"
                                />
                            }
                        />
                        <Route
                            path="/update-listing/:listingId"
                            element={
                                <UserProtectedElement
                                    element={UpdateListing}
                                    user={user}
                                    requiredUserType="Agent"
                                />
                            }
                        />
                        <Route
                            path="/reset-password"
                            element={<RecoveryPage />}
                        />
                        <Route
                            path="/forgot-password"
                            element={<ForgotPasswordPage />}
                        />
                        <Route
                            path="/dashboard/*"
                            element={
                                <UserProtectedElement
                                    element={AgentDashboard}
                                    user={user}
                                    requiredUserType="Agent"
                                />
                            }
                        />
                        <Route path="/listings" element={<ListingsPage />} />
                        <Route
                            path="/listing/:id"
                            element={<ListingDetailPage />}
                        />
                        <Route
                            path="/subscription"
                            element={<SubscriptionPage />}
                        />
                        <Route path="/search" element={<ListingSearch />} />
                        <Route
                            path="/conversations/*"
                            element={
                                <UserProtectedElement
                                    element={Conversations}
                                    user={user}
                                />
                            }
                        />

                        <Route
                            path="/favorites"
                            element={
                                <UserProtectedElement
                                    element={FavoritesPage}
                                    user={user}
                                />
                            }
                        />
                        <Route 
                            path="/checkout-success" 
                            element={<CheckoutSuccess />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    )
}

export default App
