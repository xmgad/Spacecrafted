import React from "react"
import { createContext, useReducer, useEffect } from "react"

export const AuthContext = createContext()

export const authReducer = (state, action) => {
    switch (action.type) {
        case "REGISTER":
            return { user: action.payload }
        case "LOGOUT":
            return { user: null }
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, { user: null })

    useEffect(() => {
        // Auto login if exists
        const user = JSON.parse(localStorage.getItem("user"))

        if (user) {
            dispatch({ type: "REGISTER", payload: user })
        }
    }, [])

    console.log("AuthContext state: ", state)

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}
