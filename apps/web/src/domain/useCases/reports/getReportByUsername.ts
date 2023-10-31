import { reduceDaysToReport } from '@common/helpers/reduceDaysToReport'
import { firebaseProvider } from '@common/providers/firebase'
import { QueryCompositeFilterConstraint } from 'firebase/firestore'
import { IDateRange, ILiveReportRow } from 'oitoselo-models'
import { liveReportConverter } from 'oitoselo-utils'

interface IGetReportByUsernameUseCase {
    dateRange: IDateRange
    username: string
}

export async function getReportByUsernameUseCase(filter: IGetReportByUsernameUseCase): Promise<ILiveReportRow> {
    const db = firebaseProvider.firestore()

    const collectionRef = db.collection('lives').withConverter(liveReportConverter)

    const query = db.query(collectionRef, _getCompositeFilter(filter))

    const reportSnapshot = await db.getDocs(query)

    const days = reportSnapshot.docs.map((r) => r.data())

    const report = reduceDaysToReport(days)

    return report
}

function _getCompositeFilter({ dateRange, username }: IGetReportByUsernameUseCase): QueryCompositeFilterConstraint {
    const db = firebaseProvider.firestore()

    return db.and(
        db.where('date', '>=', dateRange.from),
        db.where('date', '<=', dateRange.to),
        db.where('username', '==', username)
    )
}
