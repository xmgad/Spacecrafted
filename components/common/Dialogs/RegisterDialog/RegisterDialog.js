import React from "react"
import "./RegisterDialog.css"
import { Link, useNavigate } from "react-router-dom"
import SPCButton from "../../SPCButton/SPCButton"
import signupImage from "../../../../images/Sign-up.png"
import { ReactComponent as CheckIcon } from "../.././../../icons/CheckMark.svg"
import SPCBaseDialog from "../SPCBaseDialog/SPCBaseDialog"

const RegisterDialog = ({ isOpen, onRequestClose }) => {
    const navigate = useNavigate()
    return (
        <SPCBaseDialog
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="signup-dialog-container"
            contentLabel="Sign up"
        >
            <img src={signupImage} alt="signup" className="signup-dialog-img" />
            <div className="signup-dialog-content">
                <div className="signup-dialog-title">Sign up now!</div>
                <div className="signup-dialog-message">
                    Join us now and unlock exclusive features and benefits (and
                    an overall cooler experience!)
                </div>
                <div className="signup-dialog-item-container">
                    <div className="signup-dialog-content-item">
                        <CheckIcon className="signup-dialog-check" />
                        <p>Save listings to your favorites</p>
                    </div>
                    <div className="signup-dialog-content-item">
                        <CheckIcon className="signup-dialog-check" />
                        <p>Get in contact with property owners via live chat</p>
                    </div>
                    <div className="signup-dialog-content-item">
                        <CheckIcon className="signup-dialog-check" />
                        <p>Get early access to our newest features</p>
                    </div>
                </div>
                <SPCButton
                    onClick={() => navigate("/register")}
                    className="signup-dialog-register"
                >
                    Register now!
                </SPCButton>
                <div className="signup-dialog-login">
                    Already have an account?
                    <Link className="signup-dialog-login-link" to="/login">Login here</Link>
                </div>
            </div>
        </SPCBaseDialog>
    )
}

export default RegisterDialog
