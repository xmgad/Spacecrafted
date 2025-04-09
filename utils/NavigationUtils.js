import { useLocation, useNavigate } from "react-router-dom"

export const useNavigateSingleTop = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const navigateSingleTop = (path) => {
        if (location.pathname !== path) navigate(path)
    }
    return { navigateSingleTop }
}