import { supabase } from '@common/providers/supabase'

export async function demoteAdminUserUseCase(uid: string) {
    const { error } = await supabase.rpc('delete_claim', { uid, claim: 'claims_admin' })

    if (error) throw error
}
