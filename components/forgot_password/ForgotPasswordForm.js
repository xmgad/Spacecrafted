import React, { useState } from 'react';
import { Link } from "react-router-dom";
import SPCField from "../common/SPCField/SPCField";
import SPCLoadingButton from "../common/SPCLoadingButton/SPCLoadingButton";
import { ReactComponent as EmailIcon } from "../../icons/Email.svg";
import './ForgotPasswordForm.css';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Reset error message
        setError('');
        // Reset success message
        setMessage('');
        try {
            const response = await fetch('http://localhost:4000/api/user/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to send OTP');
            setMessage('OTP sent successfully! Check your email. Also check your junk folder!');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    let errorMessage;
    if (error) {
        errorMessage = <div className="error password-recovery-error">{error}</div>;
    }
    let successMessage;
    if (message) {
        successMessage =
            <div className="success password-recovery-message">
                {message}
                <br />
                < Link to='/reset-password' className='reset-password-link'> Click here to go to Reset Password Page</Link>
            </div >;
    }

    return (
        <form className="forgot-password-form" onSubmit={handleForgotPassword}>
            <h1 className="forgot-password-header">Forgot Password</h1>
            <SPCField
                title="Email"
                icon={EmailIcon}
                text={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                type="email"
            />
            {errorMessage}
            {successMessage}
            <SPCLoadingButton className="forgot-password-button" loading={isLoading}>
                Send OTP
            </SPCLoadingButton>
            <p className="login">
                Remembered your password? <Link to="/signin" className="login-link">Log in here!</Link>
            </p>
        </form>
    );
}

export default ForgotPasswordForm;
