import { useAuthenticationContext } from '@contexts/auth/useAuthenticationContext'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const DEFAULT_REDIRECT = '/login'

export function useAuthenticatedRoute() {
    const navigate = useNavigate()
    const location = useLocation()
    const authetication = useAuthenticationContext((context) => context.authetication)
    const redirectTo = `${DEFAULT_REDIRECT}?redirect=${location.pathname}`

    useEffect(() => {
        if (!authetication) return navigate(redirectTo)
    }, [authetication])
}
