import { reduceDaysToReport } from '@common/helpers/reduceDaysToReport'
import { supabase } from '@common/providers/supabase'
import dayjs from 'dayjs'
import { IDateRange, ILiveReportRow } from 'oitoselo-models'
import { alphabetical, group } from 'radash'

interface IGetReportsUseCase {
    dateRange: IDateRange
    uids?: string[]
}
export async function getReportsUseCase(filter: IGetReportsUseCase): Promise<ILiveReportRow[]> {
    const query = supabase
        .from('lives')
        .select('*, profiles(id, displayName, email, username)')
        .gt('duration', 0)
        .gte('date', dayjs(filter.dateRange.from).format('YYYY-MM-DD'))
        .lte('date', dayjs(filter.dateRange.to).format('YYYY-MM-DD'))

    if (filter.uids?.length) query.in('userId', filter.uids)
    else query.not('userId', 'is', null)

    const { error, data } = await query
    if (error) throw error

    const grouped = group(data, (r) => String(r.userId))

    const reportRows = Object.values(grouped).reduce<ILiveReportRow[]>((acc, days) => {
        if (days)
            acc.push({
                ...reduceDaysToReport(days),
                numberOfDays: days.length,
                username: days[0].profiles?.username || '',
                displayName: days[0].profiles?.displayName || days[0].profiles?.email || '',
            })

        return acc
    }, [])

    return alphabetical(reportRows, (row) => row.username || '')
}
