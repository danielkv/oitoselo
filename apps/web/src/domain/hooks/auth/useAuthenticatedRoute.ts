import { useAuthenticationContext } from '@contexts/auth/useAuthenticationContext'
import { IAutheticationContext, IUserClaims } from 'oitoselo-models'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const DEFAULT_REDIRECT = '/login'

export function useAuthenticatedRoute(claim?: string | ((claims: IUserClaims) => boolean)) {
    const navigate = useNavigate()
    const location = useLocation()
    const authetication = useAuthenticationContext((context) => context.authetication)
    const redirectTo = `${DEFAULT_REDIRECT}?redirect=${location.pathname}`

    useEffect(() => {
        if (!authetication) return navigate(redirectTo)

        if (!claim) return

        if (!_checkClaims(authetication, claim)) return navigate(redirectTo)
    }, [authetication, claim])
}

function _checkClaims(
    authetication: IAutheticationContext,
    claim: string | ((claims: IUserClaims) => boolean)
): boolean {
    if (typeof claim === 'string') {
        if (authetication.claims[claim] !== undefined) return true
    } else {
        if (claim(authetication.claims)) return true
    }
    return false
}
