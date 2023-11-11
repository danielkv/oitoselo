import { supabase } from '@common/providers/supabase'

export async function confirmUserUseCase(uid: string) {
    const { error } = await supabase.rpc('delete_claim', { uid, claim: 'userrole', value: 'default' })

    if (error) throw error
}
