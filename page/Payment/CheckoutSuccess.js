import React from "react"
import { useNavigate } from "react-router-dom"
import "./CheckoutSuccess.css" // Import the CSS file
import SPCButton from "../../components/common/SPCButton/SPCButton"

const CheckoutSuccess = () => {
    const navigate = useNavigate()

    const handleContinueCrafting = () => {
        navigate("/") // Navigate to the dashboard
    }

    return (
        <div className="checkout-success-container">
            <div className="outline-box">
                <div className="success-box">
                    <h1>Done!</h1>
                    <p>Now you're ready to craft spaces like no other!</p>
                </div>
                <SPCButton
                    onClick={handleContinueCrafting}
                    className="continue-button"
                >
                    Continue Crafting
                </SPCButton>
            </div>
        </div>
    )
}

export default CheckoutSuccess
