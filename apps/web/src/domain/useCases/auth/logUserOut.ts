import { firebaseProvider } from '@common/providers/firebase'
import { useAuthenticationContext } from '@contexts/auth/useAuthenticationContext'

const setAuthentication = useAuthenticationContext.getState().setAuthetication

export async function logUserOutUseCase(): Promise<void> {
    const auth = firebaseProvider.getAuth()
    setAuthentication(null)

    await auth.signOut()
}
