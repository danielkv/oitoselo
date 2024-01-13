import { supabase } from '@common/providers/supabase'

export async function unassignLiveDaysUseCase(liveIds: number[]) {
    await supabase.from('lives').update({ userId: null }).in('id', liveIds)
}
