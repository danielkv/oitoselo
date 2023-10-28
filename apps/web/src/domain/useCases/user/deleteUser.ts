import { firebaseProvider } from '@common/providers/firebase'

const deleteUserFn = firebaseProvider.FUNCTION_CALL<string>('deleteUser')

export async function deleteUserUseCase(uid: string) {
    await deleteUserFn(uid)
}
