import { supabase } from '@common/providers/supabase'
import { IUser } from 'oitoselo-models'

export async function getLoggedUser(): Promise<IUser> {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error

    const { disabled, displayName, username, photoURL } = data.user.user_metadata

    return {
        id: data.user.id,
        displayName,
        disabled,
        email: data.user.email || '',
        username,
        phone: data.user.phone,
        photoURL,
    }
}
