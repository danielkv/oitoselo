import { getAuthenticationContextUseCase } from './getAuthenticationContext'
import { firebaseProvider } from '@common/providers/firebase'
import { useAuthenticationContext } from '@contexts/auth/useAuthenticationContext'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { IUser } from 'oitoselo-models'

const setAuthentication = useAuthenticationContext.getState().setAuthetication

export async function logUserInUseCase(email: string, password: string): Promise<IUser> {
    const auth = firebaseProvider.getAuth()

    const userCredential = await signInWithEmailAndPassword(auth, email, password)

    const authContext = await getAuthenticationContextUseCase(userCredential.user)

    setAuthentication(authContext)

    return authContext.user
}
