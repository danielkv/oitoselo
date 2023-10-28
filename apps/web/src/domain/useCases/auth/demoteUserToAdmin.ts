import { firebaseProvider } from '@common/providers/firebase'

const demoteAdminUserFn = firebaseProvider.FUNCTION_CALL<string>('demoteAdminUser')

export async function demoteAdminUserUseCase(uid: string) {
    await demoteAdminUserFn(uid)
}
