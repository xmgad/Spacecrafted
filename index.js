import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import { AuthContextProvider } from "./context/AuthContext"
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


// Initialize Stripe with your public key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <Elements stripe={stripePromise}> 
        <App />
      </Elements>
    </AuthContextProvider>
  </React.StrictMode>
);