import { useAuthenticationContext } from '@contexts/auth/useAuthenticationContext'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const DEFAULT_REDIRECT = '/'

export function useAuthenticatedRedirect(redirectTo = DEFAULT_REDIRECT) {
    const navigate = useNavigate()

    const authetication = useAuthenticationContext((context) => context.authetication)

    useEffect(() => {
        if (authetication) return navigate(redirectTo)
    }, [authetication])
}
