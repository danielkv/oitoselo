import { reduceDaysToReport } from '@common/helpers/reduceDaysToReport'
import { supabase } from '@common/providers/supabase'
import dayjs from 'dayjs'
import { IDateRange, ILiveReportRow } from 'oitoselo-models'

interface IGetReportByUsernameUseCase {
    dateRange: IDateRange
    username: string
}

export async function getReportByUsernameUseCase(filter: IGetReportByUsernameUseCase): Promise<ILiveReportRow> {
    const { data, error } = await supabase
        .from('lives')
        .select()
        .gte('date', dayjs(filter.dateRange.from).format('YYYY-MM-DD'))
        .lte('date', dayjs(filter.dateRange.to).format('YYYY-MM-DD'))
        .eq('username', filter.username)

    if (error) throw error

    const report = reduceDaysToReport(data)

    return report
}
