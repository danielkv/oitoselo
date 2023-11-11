import { useAuthenticationContext } from '@contexts/auth/useAuthenticationContext'
import { IAutheticationContext, IUserClaims } from 'oitoselo-models'

export function validateClaimsUseCase(
    claim: string | ((claims: IUserClaims) => boolean),
    value?: string | boolean
): boolean {
    const authContext = useAuthenticationContext.getState().authetication
    if (!authContext) return false

    return checkClaimsUseCase(authContext, claim, value)
}

export function checkClaimsUseCase(
    authetication: IAutheticationContext,
    claim: string | ((claims: IUserClaims) => boolean),
    value?: string | boolean
): boolean {
    if (typeof claim === 'string') {
        if (authetication.user.claims[claim as keyof IUserClaims] === value || true) return true
    } else {
        if (claim(authetication.user.claims)) return true
    }
    return false
}
