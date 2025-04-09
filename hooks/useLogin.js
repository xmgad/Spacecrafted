import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext()

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:4000/api/user/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Could not log in');
            }

            localStorage.setItem('user', JSON.stringify(data)) // Save the user in browser storage
            dispatch({type: 'REGISTER', payload: data}) // update auth context
            setIsLoading(false);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return { login, error, isLoading };
}

export default useLogin;
