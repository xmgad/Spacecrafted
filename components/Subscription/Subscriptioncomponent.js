import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Subscriptioncomponent.css';
import { AuthContext } from '../../context/AuthContext';
import SubscriptionPlans from './SubscriptionPlans';

const SubscriptionManager = () => {
    const { user } = useContext(AuthContext); // Get user from AuthContext
    const navigate = useNavigate(); // Hook for programmatic navigation
    const [message, setMessage] = useState('');

    const handleCreate = async (plan) => {
        try {
            // Get User info from context
            const token = user?.token;
            const userId = user?.id;
            const response = await axios.post(
                'http://localhost:4000/api/subscription',
                { userId, plan },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );
            setMessage('Subscription created successfully.');
            navigate('/dashboard'); // Navigate to dashboard on success
        } catch (error) {
            console.error(error);
            setMessage('Failed to create subscription.');
        }
    };

    // const handleSelectPlan = (plan) => {
    //     console.log("Selected plan details:", plan);
    //     // Navigate to PaymentForm with plan details
    //     navigate(`/payment/${plan.value}`, { state: { plan } });
    // };
    
    return (
        <div className="subscription-manager">
            <SubscriptionPlans onPlanSelect={handleCreate} />
        </div>
    );
};

export default SubscriptionManager;
