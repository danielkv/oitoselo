import { createFunction } from '@common/providers/supabase'

const deleteUserFn = createFunction<{ userId: string }>('deleteUser', {
    method: 'POST',
})

export function deleteUserUseCase(userId: string) {
    return deleteUserFn({ userId })
}
