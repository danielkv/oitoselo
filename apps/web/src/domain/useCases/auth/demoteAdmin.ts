import { createFunction } from '@common/providers/supabase'

const promoteDemoteAdminFn = createFunction<{ userId: string; action: 'promote' | 'demote' }>('promoteDemoteAdmin', {
    method: 'POST',
})

export async function demoteAdminUseCase(userId: string) {
    return promoteDemoteAdminFn({ userId, action: 'demote' })
}
