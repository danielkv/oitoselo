import { useAuthenticationContext } from '@contexts/auth/useAuthenticationContext'
import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const DEFAULT_REDIRECT = '/'

export function useAuthenticatedRedirect(redirectTo?: string) {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search])

    const authetication = useAuthenticationContext((context) => context.authetication)

    useEffect(() => {
        if (!authetication) return

        const redirect = redirectTo || queryParams.get('redirect') || DEFAULT_REDIRECT
        return navigate(redirect)
    }, [authetication])
}
