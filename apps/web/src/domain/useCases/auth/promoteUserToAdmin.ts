import { supabase } from '@common/providers/supabase'

export async function promoteUserToAdminUseCase(uid: string) {
    const { error } = await supabase.rpc('set_claim', { uid, claim: 'claims_admin', value: 'true' })

    if (error) throw error
}
