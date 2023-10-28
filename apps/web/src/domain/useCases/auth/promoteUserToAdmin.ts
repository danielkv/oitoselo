import { firebaseProvider } from '@common/providers/firebase'

const promoteUserToAdminFn = firebaseProvider.FUNCTION_CALL<string>('promoteUserToAdmin')

export async function promoteUserToAdminUseCase(uid: string) {
    await promoteUserToAdminFn(uid)
}
