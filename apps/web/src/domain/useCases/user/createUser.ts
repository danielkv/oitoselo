import { supabase } from '@common/providers/supabase'
import { IUserInput, IUserMetadata } from 'oitoselo-models'
import { pick } from 'radash'

export async function createUserUseCase(userData: IUserInput): Promise<void> {
    const userMetadata: IUserMetadata = {
        ...pick(userData, ['displayName', 'photoURL', 'username']),
        disabled: false,
    }

    const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        options: {
            data: userMetadata,
        },
    })
    if (error) throw error
    if (!data.user) throw new Error('User not created')
}
