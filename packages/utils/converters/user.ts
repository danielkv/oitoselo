import { FirestoreDataConverter } from 'firebase/firestore'
import { IUser } from 'oitoselo-models/interfaces/user'
import { omit } from 'radash'

export const userConverter: FirestoreDataConverter<IUser, Omit<IUser, 'id'>> = {
    fromFirestore(snapshot) {
        return {
            id: snapshot.id,
            ...(snapshot.data() as Omit<IUser, 'id'>),
        }
    },
    toFirestore(doc) {
        const res = omit(doc, ['id'])
        return res as Omit<IUser, 'id'>
    },
}
