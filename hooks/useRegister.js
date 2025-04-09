import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext"

export const useRegister = () => {
    const [error, setError] = useState(null)
    const [isLoading, setLoading] = useState(null)
    const navigate = useNavigate();
    const { dispatch } = useAuthContext()

    const validateInput = (name, email, password, passwordConfirmation, userType) => {
        if (!name || !email || !password || !passwordConfirmation || !userType) {
            throw Error('Please fill all in required fields')
        }
        if (password !== passwordConfirmation) {
            throw Error('Password confirmation does not match')
        }
    }

    const register = async (name, email, password, passwordConfirmation, userType) => {
        setLoading(true)
        setError(null)

        try {
            validateInput(name, email, password, passwordConfirmation, userType)
        } catch (e) {
            setLoading(false)
            setError(e.message)
            return
        }

        const response = await fetch('http://localhost:4000/api/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, userType })
        })

        const json = await response.json()

        if (!response.ok) { // Request failed
            setLoading(false)
            setError(json.error) // TODO: make sure this is the correct error response format
            return
        }

        // request succeeded, handle registration
        localStorage.setItem('user', JSON.stringify(json)) // Save the user in browser storage
        dispatch({ type: 'REGISTER', payload: json }) // update auth context
        setLoading(false) // end loading
    }

    return { register, isLoading, error }
}
