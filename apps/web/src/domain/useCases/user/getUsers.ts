import { firebaseProvider } from '@common/providers/firebase'
import { QueryCompositeFilterConstraint } from 'firebase/firestore'
import { IUser } from 'oitoselo-models'
import { userConverter } from 'oitoselo-utils'

interface IGetUsersUseCase {
    search?: string
    limit?: number
    lastUserId?: string | null
}

export async function getUsersUseCase({ search, limit = 10, lastUserId }: IGetUsersUseCase): Promise<IUser[]> {
    const db = firebaseProvider.firestore()

    const userCollection = db.collection('users').withConverter(userConverter)

    const lastDocSnapshot = lastUserId ? await db.getDoc(db.doc('users', lastUserId)) : null
    const query = db.query(
        userCollection,
        _getCompositeFilter(search),
        db.orderBy('displayName', 'asc'),
        db.startAfter(lastDocSnapshot),
        db.limit(limit)
    )

    const usersSnapshot = await db.getDocs(query)

    return usersSnapshot.docs.map((doc) => doc.data())
}

function _getCompositeFilter(search?: string): QueryCompositeFilterConstraint {
    const db = firebaseProvider.firestore()

    if (search && search.length >= 3)
        return db.and(
            db.or(db.where('claims.userConfirmed', '==', true), db.where('claims.admin', '==', true)),
            db.or(
                db.and(db.where('displayName', '>=', search), db.where('displayName', '<=', search + '\uf8ff')),
                db.and(db.where('username', '>=', search), db.where('username', '<=', search + '\uf8ff')),
                db.and(db.where('email', '>=', search), db.where('email', '<=', search + '\uf8ff'))
            )
        )

    return db.or(db.where('claims.userConfirmed', '==', true), db.where('claims.admin', '==', true))
}
