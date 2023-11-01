import { firebaseProvider } from '@common/providers/firebase'
import { QueryCompositeFilterConstraint } from 'firebase/firestore'
import { IUser } from 'oitoselo-models'
import { userConverter } from 'oitoselo-utils'

type TFilterUser = { uids?: string[]; search?: never } | { uids?: never; search: string }
type IGetUsersUseCase = {
    limit?: number
    lastUserId?: string | null
} & TFilterUser

export async function getUsersUseCase({ search, uids, limit = 10, lastUserId }: IGetUsersUseCase): Promise<IUser[]> {
    const db = firebaseProvider.firestore()

    const userCollection = db.collection('users').withConverter(userConverter)

    const lastDocSnapshot = lastUserId ? await db.getDoc(db.doc('users', lastUserId)) : null
    const query = db.query(
        userCollection,
        _getCompositeFilter({ search, uids } as TFilterUser),
        db.orderBy('displayName', 'asc'),
        db.startAfter(lastDocSnapshot),
        db.limit(limit)
    )

    const usersSnapshot = await db.getDocs(query)

    return usersSnapshot.docs.map((doc) => doc.data())
}

function _getCompositeFilter(filter: TFilterUser): QueryCompositeFilterConstraint {
    const db = firebaseProvider.firestore()

    if (filter.search && filter.search.length >= 3)
        return db.and(
            db.or(db.where('claims.userConfirmed', '==', true), db.where('claims.admin', '==', true)),
            db.or(
                db.and(
                    db.where('displayName', '>=', filter.search),
                    db.where('displayName', '<=', filter.search + '\uf8ff')
                ),
                db.and(db.where('username', '>=', filter.search), db.where('username', '<=', filter.search + '\uf8ff')),
                db.and(db.where('email', '>=', filter.search), db.where('email', '<=', filter.search + '\uf8ff'))
            )
        )

    if (filter.uids?.length)
        return db.and(
            db.or(db.where('claims.userConfirmed', '==', true), db.where('claims.admin', '==', true)),
            db.where('uid', 'in', filter.uids)
        )

    return db.or(db.where('claims.userConfirmed', '==', true), db.where('claims.admin', '==', true))
}
