import { useAuthenticationContext } from '@contexts/auth/useAuthenticationContext'
import { checkClaimsUseCase } from '@useCases/auth/validateClaims'
import { IUserClaims } from 'oitoselo-models'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const DEFAULT_REDIRECT = '/login'

export function useAuthenticatedRoute(claim?: keyof IUserClaims | ((claims: IUserClaims) => boolean)) {
    const navigate = useNavigate()
    const location = useLocation()
    const authetication = useAuthenticationContext((context) => context.authetication)
    const redirectTo = `${DEFAULT_REDIRECT}?redirect=${location.pathname}`

    useEffect(() => {
        if (!authetication) return navigate(redirectTo)

        if (!claim) return

        if (!checkClaimsUseCase(authetication, claim)) return navigate(redirectTo)
    }, [authetication, claim])
}
