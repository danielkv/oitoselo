import { FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase-admin/firestore'
import { ILiveTableRow, ILiveTableRowInput } from 'oitoselo-models'
import { omit } from 'radash'

export const liveConverter: FirestoreDataConverter<ILiveTableRow> = {
    fromFirestore(snapshot: QueryDocumentSnapshot<ILiveTableRowInput>): ILiveTableRow {
        return { id: snapshot.id, ...snapshot.data() }
    },
    toFirestore(doc) {
        return omit(doc, ['id'])
    },
}
