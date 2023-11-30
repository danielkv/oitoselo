import { profileViewToUser } from '@common/helpers/profileViewToUser'
import { supabase } from '@common/providers/supabase'
import { IPagination } from '@interfaces/pagination'
import { Pagination } from '@supabase/supabase-js'
import { IUserContext } from 'oitoselo-models'

type TFilterUser = { uids?: string[]; search?: never } | { uids?: never; search: string }
type IGetUsersUseCase = IPagination & TFilterUser

interface IGetUsersUseCaseResponse extends Pagination {
    users: IUserContext[]
}

export async function getUsersUseCase({
    search,
    uids,
    limit = 10,
    page,
}: IGetUsersUseCase): Promise<IGetUsersUseCaseResponse> {
    const defaultFilter = 'raw_app_meta_data->>userrole.neq.none, raw_app_meta_data->claims_admin.eq.true'
    console.log(await supabase.auth.getSession())

    const query = supabase.from('profiles').select().or(defaultFilter)
    const queryCount = supabase.from('profiles').select('*', { count: 'exact', head: true }).or(defaultFilter)

    if (search) {
        const sbStringQuery = `email.like.%${search}%, displayName.like.%${search}%`
        query.or(sbStringQuery)
        queryCount.or(sbStringQuery)
    }

    if (uids) {
        query.in('id', uids)
        queryCount.in('id', uids)
    }

    query.order('displayName')
    queryCount.order('displayName')

    const from = page * limit
    const to = from + limit

    const { error: errorCount, count: total } = await queryCount
    if (errorCount) throw errorCount
    if (total === null) throw new Error('Ocorreu algum erro ao contar usuários')

    const { data, error } = await query.range(from, to)
    if (error) throw error
    if (!data) throw new Error('Ocorreu algum erro ao requisitar os usuários')

    const totalPages = Math.ceil(total / limit)
    const nextPage = page + 1 > totalPages ? null : page + 1

    const paginated: IGetUsersUseCaseResponse = {
        users: data.map(profileViewToUser),
        lastPage: totalPages,
        nextPage,
        total,
    }

    return paginated
}
