import Stripe from 'stripe'
import { createSubscription } from './subscriptionController.js';
import Subscription from "../models/subscriptionModel.js"; // Make sure to import your models
import User from "../models/userModel.js";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


export const createCheckoutSession = async (req, res) => {
    const { userId, plan } = req.body;

    // Define the prices for each plan
    const prices = {
        'Premium Pay-as-you-go': 999, // 9.99 USD in cents
        'Premium Monthly': 4999 // 49.99 USD in cents
    };

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: plan,
                        },
                        unit_amount: prices[plan], // amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            metadata: { userId, plan },
            success_url: 'http://localhost:3000/checkout-success', 
            cancel_url: 'http://localhost:3000/subscriptions',
        });

        res.status(200).json({ sessionId: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
};



export const handlePaymentIntentSucceeded = async (paymentIntent) => {
    console.log('PaymentIntent was successful!');

        // Extract necessary information from paymentIntent

    const userId = paymentIntent.metadata.userId; // Assuming userId is stored in metadata
    const plan = paymentIntent.metadata.plan; // Assuming plan is stored in metadata
    const paymentIntentId = paymentIntent.id;

    // Create a mock request and response object
    const req = {
        body: {
            userId,
            plan,
            paymentIntentId
        }
    };
    
    const res = {
        status: (statusCode) => ({
            json: (data) => {
                console.log(`Status: ${statusCode}`, data);
            }
        })
    };

    // Call createSubscription with the extracted data
    await createSubscription(req, res, stripe);
};


export const handlePaymentMethodAttached = async (paymentMethod) => {
    console.log('PaymentMethod was attached to a customer!');
    // Additional logic here
};

export const handleEvent = async (request, response) => {
    console.log('entered webhook endpoint');
    const sig = request.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                const userId = session.metadata.userId;
                const plan = session.metadata.plan;
                const paymentIntentId = session.payment_intent;

                // Create a mock request and response object
                const req = {
                    body: {
                        userId,
                        plan,
                        paymentIntentId,
                    }
                };
                const res = {
                    status: (statusCode) => ({
                        json: (data) => {
                            console.log(`Status: ${statusCode}`, data);
                        }
                    })
                };

                await createSubscription(req, res, stripe);
                break;
            
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        return response.json({received: true});
    } catch (err) {
        console.error('Webhook Error:', err.message);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }
};