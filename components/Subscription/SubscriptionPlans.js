import React from "react"
import "./SubscriptionPlans.css"
import SPCLoadingButton from "../common/SPCLoadingButton/SPCLoadingButton"
import MonthlyIcon from "../../icons/Monthly.svg"
import PayPerUseIcon from "../../icons/PayPerUse.svg"
import CheckMark from "../../icons/CheckMark.svg"

const SubscriptionPlans = ({ onPlanSelect, existingSubscription, loading }) => {

    const plans = [
        {
            id: 1,
            title: "Pay-Per-Use Plan",
            price: "$9.99 /staging",
            description:
                "Pay only for what you use with no monthly fees. Immediate access with no commitment.",
            features: [
                "Only pay for what you need",
                "No monthly Fees",
                "All Features are available",
            ],
            value: "Premium Pay-as-you-go",
            priceClass: "pay-per-use-price",
        },
        {
            id: 2,
            title: "Monthly Subscription Plan",
            price: "$49.99 /month",
            description:
                "Ideal for real estate professionals looking for consistent, high-quality virtual staging solutions.",
            features: [
                "Maximize Your Staging Potential with Unlimited Access",
                "Enhanced Workflow Efficiency",
                "Predictable Budgeting",
            ],
            value: "Premium Monthly",
            priceClass: "monthly-price",
        },
    ]

    console.log('sub', existingSubscription);
    return (
        <div className="subscription-plans-container">
            <h1>Best plan that suits your needs</h1>
            <div className="plans">
                {plans.map((plan) => (
                    <div className="plan-box" key={plan.id}>
                        <h2>
                            {plan.title}
                            {plan.title === "Pay-Per-Use Plan" && (
                                <img
                                    src={PayPerUseIcon}
                                    alt="Pay-as-you-go Plan Icon"
                                    className="plan-icon"
                                />
                            )}
                            {plan.title === "Monthly Subscription Plan" && (
                                <img
                                    src={MonthlyIcon}
                                    alt="Monthly Plan Icon"
                                    className="monthly-icon"
                                />
                            )}
                        </h2>
                        <p className="description">{plan.description}</p>
                        <p className={`price ${plan.priceClass}`}>
                            {plan.price}
                        </p>

                        <ul>
                            {plan.features.map((feature, index) => (
                                <li key={index}>
                                    <img
                                        src={CheckMark}
                                        alt="Check Mark"
                                        className="check-mark"
                                    />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        {(existingSubscription && existingSubscription.plan === plan.value) && <div className="already-subscribed-message">
                            Already subscribed to this plan!
                        </div> }
                        <SPCLoadingButton
                            disabled={existingSubscription != null}
                            className="get-started-btn"
                            onClick={() => onPlanSelect(plan.value)}
                            loading={loading}
                        >
                            Get Started
                        </SPCLoadingButton>

                    </div>
                ))}
            </div>
        </div>
    )
}
export default SubscriptionPlans
