import { createFunction } from '@common/providers/supabase'

const confirmUserFn = createFunction<{ userId: string }>('confirmUser')

export function confirmUserUseCase(userId: string) {
    return confirmUserFn({ userId })
}
