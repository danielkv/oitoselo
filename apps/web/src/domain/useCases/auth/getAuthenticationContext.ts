import { User } from '@supabase/supabase-js'
import { IAutheticationContext, IUserContext, IUserMetadata } from 'oitoselo-models'
import { pick } from 'radash'

export function getAuthenticationContextUseCase(user: User): IAutheticationContext {
    if (!user.email) throw new Error('User email is not set')

    const customClaims = pick(user.app_metadata, ['userrole', 'claims_admin'])

    const userData: IUserContext = {
        ...(user.user_metadata as IUserMetadata),
        id: user.id,
        email: user.email || '',
        claims: customClaims,
    }

    return {
        user: userData,
    }
}
