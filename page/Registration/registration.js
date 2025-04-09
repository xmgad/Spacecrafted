import React, { useEffect } from "react"
import RegistrationForm from "../../components/registration/RegistrationForm"
import showCaseImage from "../../images/img_registration_showcase.png"
import "./registration.css"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
    defaultAuthRedirectionState,
    useAuthContext,
} from "../../hooks/useAuthContext"

const Registration = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const { user } = useAuthContext()

    useEffect(() => {
        if (user) {
            const redirectionState =
                location.state || defaultAuthRedirectionState(user)
            const { redirect } = redirectionState
            console.log("redirect:", redirect)
            navigate(redirect, { replace: true })
        }
    }, [user])

    return (
        <div className="registration">
            <img
                className="registration-image"
                src={showCaseImage}
                alt="Registration Showcase"
            />
            <RegistrationForm />
        </div>
    )
}

export default Registration
