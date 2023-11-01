import { reduceDaysToReport } from '@common/helpers/reduceDaysToReport'
import { firebaseProvider } from '@common/providers/firebase'
import { QueryCompositeFilterConstraint } from 'firebase/firestore'
import { IDateRange, ILiveDayRow, ILiveReportRow } from 'oitoselo-models'
import { liveReportConverter } from 'oitoselo-utils'
import { alphabetical, group } from 'radash'

interface IGetUnkownReportsUseCase {
    dateRange: IDateRange
    uids?: string[]
    lastUserId?: string | null
}
export async function getUnkownReportsUseCase(filter: IGetUnkownReportsUseCase): Promise<ILiveReportRow[]> {
    const db = firebaseProvider.firestore()

    const collectionRef = db.collection('lives').withConverter(liveReportConverter)

    const query = db.query(collectionRef, _getCompositeFilter(filter))

    const reportSnapshot = await db.getDocs(query)

    const grouped = group(
        reportSnapshot.docs.map((r) => r.data()),
        (r) => r.username
    )

    const reportRows = Object.values(grouped)
        .filter((d) => d)
        .map<ILiveReportRow>((days) => reduceDaysToReport(days as ILiveDayRow[]))

    return alphabetical(reportRows, (row) => row.displayName)
}

function _getCompositeFilter({ dateRange, uids }: IGetUnkownReportsUseCase): QueryCompositeFilterConstraint {
    const db = firebaseProvider.firestore()

    if (uids?.length)
        return db.and(
            db.where('uid', '==', 'unknown'),
            db.where('date', '>=', dateRange.from),
            db.where('date', '<=', dateRange.to),
            db.where('uid', 'in', uids)
        )

    return db.and(
        db.where('uid', '==', 'unknown'),
        db.where('date', '>=', dateRange.from),
        db.where('date', '<=', dateRange.to)
    )
}
