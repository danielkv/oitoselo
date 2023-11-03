import { reduceDaysToReport } from '@common/helpers/reduceDaysToReport'
import { firebaseProvider } from '@common/providers/firebase'
import { QueryCompositeFilterConstraint } from 'firebase/firestore'
import { IDateRange, ILiveDayRow, ILiveReportRow } from 'oitoselo-models'
import { liveReportConverter } from 'oitoselo-utils'
import { alphabetical, group } from 'radash'

interface IGetReportsUseCase {
    dateRange: IDateRange
    uids?: string[]
    lastUserId?: string | null
}
export async function getReportsUseCase(filter: IGetReportsUseCase): Promise<ILiveReportRow[]> {
    const db = firebaseProvider.firestore()

    const collectionRef = db.collection('lives').withConverter(liveReportConverter)

    const query = db.query(collectionRef, _getCompositeFilter(filter))

    const reportSnapshot = await db.getDocs(query)

    const grouped = group(
        reportSnapshot.docs.map((r) => r.data()),
        (r) => r.uid
    )

    const reportRows = Object.values(grouped)
        .filter((d) => d)
        .map<ILiveReportRow>((days) => reduceDaysToReport(days as ILiveDayRow[]))

    return alphabetical(reportRows, (row) => row.displayName)
}

function _getCompositeFilter({ dateRange, uids }: IGetReportsUseCase): QueryCompositeFilterConstraint {
    const db = firebaseProvider.firestore()

    if (uids?.length)
        return db.and(
            db.where('uid', 'in', uids),
            db.and(db.where('date', '>=', dateRange.from), db.where('date', '<=', dateRange.to))
        )

    return db.and(
        db.where('uid', '!=', 'unknown'),
        db.and(db.where('date', '>=', dateRange.from), db.where('date', '<=', dateRange.to))
    )
}
