import { firebaseProvider } from '@common/providers/firebase'
import { QueryCompositeFilterConstraint } from 'firebase/firestore'
import { IDateRange, ILiveDayRow } from 'oitoselo-models'
import { liveReportConverter } from 'oitoselo-utils'

interface IGetUnkownReportsUseCase {
    dateRange: IDateRange
    lastUserId?: string | null
}
export async function getUnassignedLiveReportsUseCase(filter: IGetUnkownReportsUseCase): Promise<ILiveDayRow[]> {
    const db = firebaseProvider.firestore()

    const collectionRef = db.collection('lives').withConverter(liveReportConverter)

    const query = db.query(
        collectionRef,
        _getCompositeFilter(filter),
        db.orderBy('username', 'asc'),
        db.orderBy('date', 'desc')
    )

    const reportSnapshot = await db.getDocs(query)

    return reportSnapshot.docs.map((r) => r.data())
}

function _getCompositeFilter({ dateRange }: IGetUnkownReportsUseCase): QueryCompositeFilterConstraint {
    const db = firebaseProvider.firestore()

    return db.and(
        db.where('uid', '==', 'unknown'),
        db.where('date', '>=', dateRange.from),
        db.where('date', '<=', dateRange.to)
    )
}
