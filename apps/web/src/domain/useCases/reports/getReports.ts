import { firebaseProvider } from '@common/providers/firebase'
import { QueryCompositeFilterConstraint } from 'firebase/firestore'
import { IDateRange, ILiveDayRow, ILiveReportRow } from 'oitoselo-models'
import { liveReportConverter } from 'oitoselo-utils'
import { alphabetical, group, sort } from 'radash'

interface IGetReportsUseCase {
    dateRange: IDateRange
    uids?: string[]
}
export async function getReportsUseCase(filter: IGetReportsUseCase): Promise<ILiveReportRow[]> {
    const db = firebaseProvider.firestore()

    const collectionRef = db.collection('lives').withConverter(liveReportConverter)

    const query = db.query(collectionRef, _getCompositeFilter(filter), db.orderBy('displayName', 'asc'))

    const reportSnapshot = await db.getDocs(query)

    const grouped = group(
        reportSnapshot.docs.map((r) => r.data()),
        (r) => r.uid
    )

    const reportRows = Object.values(grouped)
        .filter((d) => d)
        .map<ILiveReportRow>((days) =>
            (days as ILiveDayRow[]).reduce<ILiveReportRow>((acc, day) => {
                if (!day) return acc
                return {
                    uid: day.uid,
                    displayName: day.displayName,
                    username: day.username,
                    diamonds: (acc.diamonds || 0) + day.diamonds,
                    duration: (acc.duration || 0) + day.duration,
                }
            }, {} as ILiveReportRow)
        )

    return alphabetical(reportRows, (row) => row.displayName)
}

function _getCompositeFilter({ dateRange, uids }: IGetReportsUseCase): QueryCompositeFilterConstraint {
    const db = firebaseProvider.firestore()

    if (uids?.length)
        return db.and(
            db.where('date', '>=', dateRange.from),
            db.where('date', '<=', dateRange.to),
            db.where('uid', 'in', uids)
        )

    return db.and(db.where('date', '>=', dateRange.from), db.where('date', '<=', dateRange.to))
}
