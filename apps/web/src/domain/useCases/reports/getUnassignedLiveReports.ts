import { buildPaginatedResponse, getPagination } from '@common/helpers/pagination'
import { getSorting } from '@common/helpers/sorting'
import { supabase } from '@common/providers/supabase'
import { IPaginatedResponse, IPagination } from '@interfaces/pagination'
import { ISorting } from '@interfaces/sorting'
import dayjs from 'dayjs'
import { IDateRange, ILiveDayRow } from 'oitoselo-models'

interface IGetUnkownReportsUseCase extends IPagination, ISorting<ILiveDayRow> {
    dateRange: IDateRange
}

export async function getUnassignedLiveReportsUseCase(
    filter: IGetUnkownReportsUseCase
): Promise<IPaginatedResponse<ILiveDayRow>> {
    const { from, to } = getPagination(filter)
    const { order, sortBy } = getSorting(filter, 'username')

    const { data, error, count } = await supabase
        .from('lives')
        .select('*', { count: 'exact' })
        .gte('date', dayjs(filter.dateRange.from).format('YYYY-MM-DD'))
        .lte('date', dayjs(filter.dateRange.to).format('YYYY-MM-DD'))
        .is('userId', null)
        .order(sortBy, { ascending: order === 'asc' })
        .order('date', { ascending: false })
        .range(from, to - 1)

    if (error) throw error
    if (count === null) throw new Error('No total count')

    return buildPaginatedResponse(data, count, filter)
}
