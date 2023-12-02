import { buildPaginatedResponse, getPagination } from '@common/helpers/pagination'
import { profileViewToUser } from '@common/helpers/profileViewToUser'
import { getSorting } from '@common/helpers/sorting'
import { supabase } from '@common/providers/supabase'
import { IPaginatedResponse, IPagination } from '@interfaces/pagination'
import { ISorting } from '@interfaces/sorting'
import { IUserContext } from 'oitoselo-models'

type TFilterUser = { uids?: string[]; search?: never } | { uids?: never; search: string }

type IGetUsersUseCase = IPagination & ISorting<IUserContext> & TFilterUser

export async function getUsersUseCase(filter: IGetUsersUseCase): Promise<IPaginatedResponse<IUserContext>> {
    const { from, to } = getPagination(filter)
    const { sortBy, order } = getSorting(filter, 'displayName')

    const query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .or('raw_app_meta_data->>userrole.neq.none, raw_app_meta_data->claims_admin.eq.true')

    if (filter.search) query.or(`email.like.%${filter.search}%, displayName.like.%${filter.search}%`)

    if (filter.uids) query.in('id', filter.uids)

    const { data, error, count } = await query.order(sortBy, { ascending: order === 'asc' }).range(from, to)
    if (error) throw error
    if (count === null) throw new Error('Ocorreu algum erro ao contar usuários')

    return buildPaginatedResponse(data.map(profileViewToUser), count, filter)
}
