import { createFunction } from '@common/providers/supabase'

const promoteDemoteAdminFn = createFunction<{ userId: string; action: 'promote' | 'demote' }>('promoteDemoteAdmin', {
    method: 'POST',
})

export async function promoteAdminUseCase(userId: string) {
    return promoteDemoteAdminFn({ userId, action: 'promote' })
}
