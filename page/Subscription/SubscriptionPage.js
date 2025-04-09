import React, { useState, useContext, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "./SubscriptionPage.css"
import { AuthContext } from "../../context/AuthContext"
import SubscriptionPlans from "../../components/Subscription/SubscriptionPlans"
import { loadStripe } from "@stripe/stripe-js"
import RegisterDialog from "../../components/common/Dialogs/RegisterDialog/RegisterDialog"
import { useGetSubscription } from "../../hooks/Subscription/useGetSubscription"

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY)

const SubscriptionManager = () => {
    const { user } = useContext(AuthContext)
    const [message, setMessage] = useState("")
    const [showRegisterDialog, setShowRegisterDialog] = useState(false)
    const { getSubscription, isLoading, error } = useGetSubscription()
    const [existingSubscription, setExistingSubscription] = useState(null)
    const [creatingCheckout, setCreatingCheckout] = useState(false)

    useEffect(() => {
        const getExistingSubscription = async (userId, token) => {
            const subscription = await getSubscription(userId, token)
            if (subscription) setExistingSubscription(subscription)
        }
        if (user) getExistingSubscription(user.id, user.token)
    }, [user])

    const handleCreate = async (plan) => {
        if (!user) {
            setShowRegisterDialog(true)
            return
        }
        try {
            setCreatingCheckout(true)
            const stripe = await stripePromise
            // Get User info from context
            const token = user.token
            const userId = user.id

            console.log("Creating checkout session with:", { userId, plan })

            const response = await axios.post(
                "http://localhost:4000/api/payment/create-checkout-session",
                { userId, plan },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            )

            const { sessionId } = response.data
            console.log("Received sessionId:", sessionId)

            // Redirect to Stripe Checkout
            const { error } = await stripe.redirectToCheckout({ sessionId })

            if (error) {
                setCreatingCheckout(false)
                console.error("Stripe Checkout error:", error)
                setMessage("Failed to redirect to Stripe Checkout.")
            }
        } catch (error) {
            console.error("Error creating checkout session:", error)
            setMessage("Failed to create checkout session.")
        }
    }

    return (
        <div className="subscription-manager">
            <SubscriptionPlans
                onPlanSelect={handleCreate}
                existingSubscription={existingSubscription}
                loading={isLoading || creatingCheckout}
            />
            {message && <p>{message}</p>}
            <RegisterDialog
                isOpen={showRegisterDialog}
                onRequestClose={() => setShowRegisterDialog(false)}
            ></RegisterDialog>
        </div>
    )

    // const handleCreate = async (plan) => {
    //     try {
    //         // Get User info from context
    //         const token = user?.token;
    //         const userId = user?.id;
    //         const response = await axios.post(
    //             'http://localhost:4000/api/subscription',
    //             { userId, plan },
    //             {
    //                 headers: { Authorization: `Bearer ${token}` },
    //                 withCredentials: true,
    //             }
    //         );
    //         setMessage('Subscription created successfully.');
    //         navigate('/my-dashboard'); // Navigate to dashboard on success
    //     } catch (error) {
    //         console.error(error);
    //         setMessage('Failed to create subscription.');
    //     }
    // };

    // return (
    //     <div className="subscription-manager">
    //         <SubscriptionPlans onPlanSelect={handleCreate} />
    //     </div>
    // );
}

export default SubscriptionManager
