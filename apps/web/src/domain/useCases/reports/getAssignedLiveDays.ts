import { buildPaginatedResponse, getPagination } from '@common/helpers/pagination'
import { supabase } from '@common/providers/supabase'
import { IPaginatedResponse, IPagination } from '@interfaces/pagination'
import dayjs from 'dayjs'
import { IDateRange, ILiveDayRow } from 'oitoselo-models'

interface IGetAssignedDaysUseCase extends IPagination {
    dateRange: IDateRange
    userId: string
}

export async function getAssignedLiveDaysUseCase(
    filter: IGetAssignedDaysUseCase
): Promise<IPaginatedResponse<ILiveDayRow>> {
    const { from, to } = getPagination(filter)

    const { data, error, count } = await supabase
        .from('lives')
        .select('*', { count: 'exact' })
        .eq('userId', filter.userId)
        .gt('duration', 0)
        .gte('date', dayjs(filter.dateRange.from).format('YYYY-MM-DD'))
        .lte('date', dayjs(filter.dateRange.to).format('YYYY-MM-DD'))
        .order('date', { ascending: true })
        .range(from, to - 1)

    if (error) throw error
    if (count === null) throw new Error('No total count')

    return buildPaginatedResponse(data, count, filter)
}
