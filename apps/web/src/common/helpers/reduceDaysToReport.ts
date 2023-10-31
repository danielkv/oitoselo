import { ILiveDayRow, ILiveReportRow } from 'oitoselo-models'

export function reduceDaysToReport(days: ILiveDayRow[]) {
    return days.reduce<ILiveReportRow>((acc, day) => {
        if (!day) return acc
        return {
            uid: day.uid,
            displayName: day.displayName,
            username: day.username,
            diamonds: (acc.diamonds || 0) + day.diamonds,
            duration: (acc.duration || 0) + day.duration,
        }
    }, {} as ILiveReportRow)
}
