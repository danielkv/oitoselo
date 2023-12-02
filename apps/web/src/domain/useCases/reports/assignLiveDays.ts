import { supabase } from '@common/providers/supabase'

export async function assignLiveDaysUseCase(liveIds: number[], userId: string) {
    await supabase.from('lives').update({ userId }).in('id', liveIds)
}
