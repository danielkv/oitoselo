import { supabase } from '@common/providers/supabase'
import { useAuthenticationContext } from '@contexts/auth/useAuthenticationContext'

const setAuthentication = useAuthenticationContext.getState().setAuthetication

export async function logUserOutUseCase(): Promise<void> {
    setAuthentication(null)

    await supabase.auth.signOut()
}
