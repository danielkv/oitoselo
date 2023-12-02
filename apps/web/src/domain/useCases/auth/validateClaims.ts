import { useAuthenticationContext } from '@contexts/auth/useAuthenticationContext'
import { IAutheticationContext, IUserClaims } from 'oitoselo-models'

export function validateClaimsUseCase(
    claim: keyof IUserClaims | ((claims: IUserClaims) => boolean),
    value?: string | boolean
): boolean {
    const authContext = useAuthenticationContext.getState().authetication
    if (!authContext) return false

    return checkClaimsUseCase(authContext, claim, value)
}

export function checkClaimsUseCase(
    authetication: IAutheticationContext,
    claim: keyof IUserClaims | ((claims: IUserClaims) => boolean),
    value?: string | boolean
): boolean {
    if (typeof claim === 'string') {
        const claimValue = authetication.user.claims[claim]

        if (value === undefined) return claimValue !== undefined
        if (authetication.user.claims[claim] === value) return true
    } else {
        if (claim(authetication.user.claims)) return true
    }

    return false
}
