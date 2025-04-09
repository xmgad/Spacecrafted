import React, { useEffect, useState } from "react"
import useLogin from "../../hooks/useLogin"
import SPCLoadingButton from "../../components/common/SPCLoadingButton/SPCLoadingButton"
import SPCField from "../../components/common/SPCField/SPCField"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { ReactComponent as EmailIcon } from "../../icons/Email.svg"
import { ReactComponent as PasswordIcon } from "../../icons/Lock.svg"
import "./sign-in.css"
import { defaultAuthRedirectionState, useAuthContext } from "../../hooks/useAuthContext"

const SignIn = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { user } = useAuthContext()
    let redirectionState = location.state

    useEffect(() => {
        if (user) {
            redirectionState =
                location.state || defaultAuthRedirectionState(user)
            const { redirect } = redirectionState
            console.log("redirect:", redirect)
            navigate(redirect, { replace: true })
        }
    }, [user])

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // Login hook
    const { login, error, isLoading } = useLogin()

    const handleLogin = async (e) => {
        e.preventDefault()
        await login(email, password)
    }

    return (
        <div className="sign-in-page">
            <div className="sign-in-page__colored-section">
                <div className="black-triangle"></div>
                <div className="grey-triangle"></div>
            </div>
            <div className="sign-in-page__content">
                <div className="sign-in-page__left-side">
                    <h1 className="sign-in-page__title">
                        Turn today's space into tomorrow's home
                    </h1>
                </div>
                <div className="sign-in-page__right-side">
                    <h2 className="sign-in-header">Sign In</h2>
                    <form className="sign-in-form" onSubmit={handleLogin}>
                        <p style={{ marginBottom: "15px" }}>
                            If you don't have an account, you can{" "}
                            <Link
                                className="inline-link"
                                to="/register"
                                replace={true}
                                state={redirectionState}
                            >
                                register here!
                            </Link>
                        </p>

                        <SPCField
                            title="Email"
                            icon={EmailIcon}
                            text={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your e-mail address"
                            type="email"
                        />

                        <SPCField
                            title="Password"
                            icon={PasswordIcon}
                            text={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            type="password"
                        />

                        {error && (
                            <div className="error sign-in-error">{error}</div>
                        )}

                        <p>
                            <Link
                                to="/forgot-password"
                                className="forgot-password"
                            >
                                forgot password?
                            </Link>
                        </p>

                        <SPCLoadingButton
                            className="sign-in-button"
                            loading={isLoading}
                        >
                            Sign In
                        </SPCLoadingButton>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignIn
