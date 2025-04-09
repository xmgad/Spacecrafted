import Subscription from "../models/subscriptionModel.js"
import User from "../models/userModel.js"

// Create a new subscription
const createSubscription = async (req, res, stripe) => {
    console.log("Received request to create subscription with data:", req.body)
    const { userId, plan, paymentIntentId } = req.body

    try {
        console.log(`Retrieving payment intent for ID: ${paymentIntentId}`)

        //Verify payment intent status with Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentId
        )
        if (paymentIntent.status !== "succeeded") {
            console.error(
                `Payment verification failed for intent ID: ${paymentIntentId}`
            )
            return res
                .status(400)
                .json({ message: "Payment verification failed" })
        }

        // Fetch user details
        const user = await User.findById(userId)
        if (!user) {
            console.error(`User not found for ID: ${userId}`)
            return res.status(404).json({ message: "User not found" })
        }

        // Check if user is agent
        if (user.userType !== "Agent") {
            console.error(
                `Unauthorized subscription attempt by user ID: ${userId}`
            )
            return res
                .status(403)
                .json({ message: "Only agents can subscribe to plans" })
        }

        // Create subscription
        const subscription = new Subscription({
            userId,
            plan,
        })

        if (plan === "Premium Monthly") {
            subscription.numStagings = 30
        }
        const sub = await subscription.save()
        if (sub) {
            user.subscriptionId = sub._id
            await user.save()
            console.log(
                `Subscription created successfully for user ID: ${userId}`
            )
            res.status(201).json(subscription)
        } else {
            res.status(500).json({message: "Failed to create subscription"})
        }

    } catch (error) {
        console.error(
            `Error creating subscription for user ID: ${userId}: ${error.message}`
        )
        res.status(400).json({
            message: "Failed to create subscription",
            error: error.message,
        })
    }
}

const updateSubscriptionPlan = async (req, res) => {
    const { userId } = req.params
    const { newPlan } = req.body
    try {
        const subscription = await Subscription.findOne({ userId })
        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" })
        }

        // Check if the plan can be changed
        if (!subscription.canChangePlan()) {
            return res
                .status(403)
                .json({
                    message:
                        "Plan can only be changed after the current plan has expired",
                })
        }

        // Update the plan reset the dates
        subscription.plan = newPlan
        subscription.startDate = new Date()
        subscription.endDate = new Date(
            subscription.startDate.getTime() + 30 * 24 * 60 * 60 * 1000
        ) //  endDate = 30 days

        await subscription.save()
        res.status(200).json(subscription)
    } catch (error) {
        res.status(500).json({
            message: "Failed to update subscription plan",
            error: error.message,
        })
    }
}

// Get subscription details
const getSubscription = async (req, res) => {
    const { userId } = req.params
    try {
        const subscription = await Subscription.findOne({ userId })
        if (!subscription) {
            return res.status(404).json({ message: "No subscription found" })
        }
        res.status(200).json(subscription)
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch subscription",
            error: error.message,
        })
    }
}

export { createSubscription, getSubscription, updateSubscriptionPlan }

// // Create a new subscription
// const createSubscription = async (req, res) => {
//     console.log("Received request to create subscription with data:", req.body);
//     const { userId, plan, paymentIntentId } = req.body;

//     try {
//         console.log(`Retrieving payment intent for ID: ${paymentIntentId}`);

//         //Verify payment intent status with Stripe
//         const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
//         if (paymentIntent.status !== 'succeeded') {
//             console.error(`Payment verification failed for intent ID: ${paymentIntentId}`);
//             return res.status(400).json({message: "Payment verification failed"});
//         }

//             // Fetch user details
//             const user = await User.findById(userId);
//             if (!user) {
//                 console.error(`User not found for ID: ${userId}`);
//                 return res.status(404).json({ message: "User not found" });
//             }

//             // Check if user is agent
//             if (user.userType !== 'Agent') {
//                 console.error(`Unauthorized subscription attempt by user ID: ${userId}`);
//                 return res.status(403).json({ message: "Only agents can subscribe to plans" });
//             }

//             // Create subscription
//             const subscription = new Subscription({
//                 userId,
//                 plan
//             });

//             await subscription.save();
//             console.log(`Subscription created successfully for user ID: ${userId}`);
//             res.status(201).json(subscription);

//         } catch (error) {
//             console.error(`Error creating subscription for user ID: ${userId}: ${error.message}`);
//             res.status(400).json({ message: "Failed to create subscription", error: error.message });
//         }
//     };
