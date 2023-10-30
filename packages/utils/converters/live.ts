import { FirestoreDataConverter } from 'firebase/firestore'
import { ILiveDayRow } from 'oitoselo-models'
import { omit } from 'radash'

export const liveReportConverter: FirestoreDataConverter<ILiveDayRow, Omit<ILiveDayRow, 'id'>> = {
    fromFirestore(snapshot): ILiveDayRow {
        return {
            id: snapshot.id,
            ...(snapshot.data() as Omit<ILiveDayRow, 'id'>),
        }
    },
    toFirestore(doc) {
        const res = omit(doc, ['id'])
        return res as Omit<ILiveDayRow, 'id'>
    },
}
