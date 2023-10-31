import { useAuthenticationContext } from '@contexts/auth/useAuthenticationContext'
import { IAutheticationContext, IUserClaims } from 'oitoselo-models'

export function validateClaimsUseCase(claim: string | ((claims: IUserClaims) => boolean)): boolean {
    const authContext = useAuthenticationContext.getState().authetication
    if (!authContext) return false

    return checkClaimsUseCase(authContext, claim)
}

export function checkClaimsUseCase(
    authetication: IAutheticationContext,
    claim: string | ((claims: IUserClaims) => boolean)
): boolean {
    if (typeof claim === 'string') {
        if (authetication.claims[claim as keyof IUserClaims] === true) return true
    } else {
        if (claim(authetication.claims)) return true
    }
    return false
}
