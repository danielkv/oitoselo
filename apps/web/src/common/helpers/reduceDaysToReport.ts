import { ILiveDayRow, ILiveReportRow } from 'oitoselo-models'

export function reduceDaysToReport(days: ILiveDayRow[]): ILiveReportRow {
    return days.reduce<ILiveReportRow>((acc, day) => {
        if (!day) return acc
        return {
            userId: day.userId,
            displayName: '',
            username: day.username,
            diamonds: (acc.diamonds || 0) + day.diamonds,
            duration: (acc.duration || 0) + day.duration,
        }
    }, {} as ILiveReportRow)
}
