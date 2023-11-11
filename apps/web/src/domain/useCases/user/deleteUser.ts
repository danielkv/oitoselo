import { supabase } from '@common/providers/supabase'

export async function deleteUserUseCase(uid: string) {
    await supabase.auth.admin.deleteUser(uid, true)
}
