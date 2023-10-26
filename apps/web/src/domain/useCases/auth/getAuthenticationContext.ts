import { firebaseProvider } from '@common/providers/firebase'
import { User } from 'firebase/auth'
import { IAutheticationContext } from 'oitoselo-models'
import { userConverter } from 'oitoselo-utils'
import { omit } from 'radash'

export async function getAuthenticationContextUseCase(user: User): Promise<IAutheticationContext> {
    const db = firebaseProvider.firestore()
    const userSnapshot = await db.getDoc(db.doc('users', user.uid).withConverter(userConverter))

    if (!userSnapshot.exists()) throw new Error('Usuário não encontrado')

    const { claims } = await user.getIdTokenResult()
    const customClaims = omit(claims, ['exp', 'sub', 'auth_time', 'iat', 'firebase'])

    return { user: userSnapshot.data(), claims: customClaims }
}
