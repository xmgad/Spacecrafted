import React, { useState } from 'react';
import { Link } from "react-router-dom";
import SPCField from "../common/SPCField/SPCField";
import SPCLoadingButton from "../common/SPCLoadingButton/SPCLoadingButton";
import { ReactComponent as EmailIcon } from "../../icons/Email.svg";
import { ReactComponent as PasswordIcon } from "../../icons/Lock.svg";
import './PasswordRecoveryForm.css';

const PasswordRecoveryForm = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(''); // Reset error message
        try {
            const response = await fetch('http://localhost:4000/api/user/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, otp, newPassword })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to reset password');
            // Reset form 
            setEmail('');
            setOtp('');
            setNewPassword('');
            alert('Password successfully reset!');
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
    let successMessageElement;
    if (successMessage) {
        successMessageElement = <div className="success password-recovery-message">{successMessage}</div>;
    }

    return (
        <form className="password-recovery-form" onSubmit={handlePasswordReset}>
            <h1 className="password-recovery-header">Reset Your Password</h1>
            <SPCField
                title="Email"
                icon={EmailIcon}
                text={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                type="email"
            />
            <SPCField
                title="OTP"
                icon={PasswordIcon}
                text={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter your OTP"
            />
            <SPCField
                title="New Password"
                icon={PasswordIcon}
                text={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                type="password"
            />
            {errorMessage}
            {successMessage}
            <SPCLoadingButton className="password-reset-button" loading={isLoading}>
                Reset Password
            </SPCLoadingButton>
            <p className="login">
                If you remember your password, <Link to="/login" className="login-link">log in here!</Link>
            </p>
        </form>
    );
}

export default PasswordRecoveryForm;
