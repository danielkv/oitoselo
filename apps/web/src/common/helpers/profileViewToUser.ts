import { IUser, IUserClaims, IUserContext, Tables } from 'oitoselo-models'
import { omit } from 'radash'

export function profileViewToUser(profile: Tables<'profiles'>): IUserContext {
    const data = omit(profile, ['raw_app_meta_data']) as IUser

    return {
        ...data,
        claims: extractClaims(profile.raw_app_meta_data),
    }
}

function extractClaims(data: Tables<'profiles'>['raw_app_meta_data']): IUserClaims {
    if (!data || Array.isArray(data) || typeof data !== 'object')
        return {
            claims_admin: false,
            userrole: 'none',
        }

    const claims_admin =
        typeof data.claims_admin === 'boolean' || data.claims_admin === 'true' ? !!data.claims_admin : false

    const userrole = (typeof data.userrole === 'string' ? data.userrole : 'none') as IUserClaims['userrole']

    return {
        claims_admin,
        userrole,
    }
}
