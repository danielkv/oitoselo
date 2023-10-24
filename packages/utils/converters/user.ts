import { FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase-admin/firestore'
import { IUser } from 'oitoselo-models/interfaces/user'

export const userConverter: FirestoreDataConverter<IUser> = {
    fromFirestore(snapshot: QueryDocumentSnapshot<IUser>) {
        return snapshot.data()
    },
    toFirestore(doc) {
        return doc
    },
}
