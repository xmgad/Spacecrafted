import React, { useState } from 'react';
import { useRegister } from "../../hooks/useRegister"
import SPCLoadingButton from "../common/SPCLoadingButton/SPCLoadingButton"
import SPCField from "../common/SPCField/SPCField"
import "./RegistrationForm.css"
import { Link, useLocation } from "react-router-dom"
// icon imports
import { ReactComponent as EmailIcon } from "../../icons/Email.svg"
import { ReactComponent as PersonIcon } from "../../icons/Person.svg"
import { ReactComponent as PasswordIcon } from "../../icons/Lock.svg"

const RegistrationForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [userType, setUserType] = useState("");

  const location = useLocation()
  const redirectionState = location.state || { redirect: "/" }

  const { register, error, isLoading } = useRegister()

  const handleRegister = async (e) => {
    e.preventDefault();
    await register(name, email, password, passwordConfirmation, userType);
  }

  return (
    <form className="registration-form" onSubmit={handleRegister}>
      <h1 className="sign-up-header">Sign up</h1>

      <p>
        If you already have an account register
        <br />
        you can <Link className="inline-link" to="/login" state={redirectionState} replace={true}>Login here!</Link>
      </p>

      <SPCField
        title="Name"
        icon={PersonIcon}
        text={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your full name"
      />

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
        placeholder="Enter your desired password"
        type="password"
      />

      <SPCField
        title="Password confirmation"
        icon={PasswordIcon}
        text={passwordConfirmation}
        onChange={(e) => setPasswordConfirmation(e.target.value)}
        placeholder="Confirm your password"
        type="password"
      />

      <div className="spc-field">
        <label>User Type</label>
        <select
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          className="spc-select"
        >
          <option value="Buyer">Buyer</option>
          <option value="Agent">Agent</option>
        </select>
      </div>
      {error && <div className="error registration-error">{error}</div>}

      <SPCLoadingButton className="sign-up-button" loading={isLoading}>
        Register
      </SPCLoadingButton>
    </form>
  )
}

export default RegistrationForm;