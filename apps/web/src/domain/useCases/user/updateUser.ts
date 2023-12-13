import { supabase } from '@common/providers/supabase'
import { IUserInput, IUserMetadata } from 'oitoselo-models'
import { pick } from 'radash'

export async function updateLoggedUserUseCase(userData: Partial<IUserInput>): Promise<void> {
    const userMetadata: Partial<IUserMetadata> = pick(userData, ['displayName', 'photoURL', 'username'])

    const { data, error } = await supabase.auth.updateUser({
        email: userData.email,
        phone: userData.phone || undefined,
        data: userMetadata,
    })
    if (error) throw error
    if (!data.user) throw new Error('User not updated')
}
