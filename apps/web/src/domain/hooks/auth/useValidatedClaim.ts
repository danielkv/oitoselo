import { validateClaimsUseCase } from '@useCases/auth/validateClaims'
import { IUserClaims } from 'oitoselo-models'
import { useEffect, useState } from 'react'

export function useValidatedClaim(claim: keyof IUserClaims | ((claims: IUserClaims) => boolean)) {
    const [result, setResult] = useState(false)

    useEffect(() => {
        setResult(validateClaimsUseCase(claim))
    }, [claim])

    return result
}
