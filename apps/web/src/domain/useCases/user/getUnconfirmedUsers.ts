import { firebaseProvider } from '@common/providers/firebase'
import { IUser } from 'oitoselo-models'
import { userConverter } from 'oitoselo-utils'

export async function getUnconfirmedUsersUseCase(): Promise<IUser[]> {
    const db = firebaseProvider.firestore()

    const userCollection = db.collection('users').withConverter(userConverter)

    const query = db.query(
        userCollection,
        db.where('claims.userConfirmed', '==', false),
        db.where('claims.admin', '==', false),
        db.orderBy('displayName', 'asc')
    )

    const usersSnapshot = await db.getDocs(query)

    return usersSnapshot.docs.map((doc) => doc.data())
}
