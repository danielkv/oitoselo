import { getAuthenticationContextUseCase } from './getAuthenticationContext'
import { supabase } from '@common/providers/supabase'
import { useAuthenticationContext } from '@contexts/auth/useAuthenticationContext'
import { IUser } from 'oitoselo-models'

const setAuthentication = useAuthenticationContext.getState().setAuthetication

export async function logUserInUseCase(email: string, password: string): Promise<IUser> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error

    const authContext = getAuthenticationContextUseCase(data.user)

    setAuthentication(authContext)

    return authContext.user
}
