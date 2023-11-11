import { profileViewToUser } from '@common/helpers/profileViewToUser'
import { supabase } from '@common/providers/supabase'
import { IUserContext } from 'oitoselo-models'

export async function getUnconfirmedUsersUseCase(): Promise<IUserContext[]> {
    const query = supabase.from('profiles').select()

    query
        .or('raw_app_meta_data->>userrole.eq.default, raw_app_meta_data->userrole.is.null')
        .order('displayName', { ascending: true })

    const { data, error } = await query
    if (error) throw error
    if (!data) throw new Error('Ocorreu algum erro ao requisitar os usuários')

    return data.map(profileViewToUser)
}
