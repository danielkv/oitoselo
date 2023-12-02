import { supabase } from '@common/providers/supabase'

export async function deleteLiveDaysUseCase(ids: number[]) {
    await supabase.from('lives').delete().in('id', ids)
}
