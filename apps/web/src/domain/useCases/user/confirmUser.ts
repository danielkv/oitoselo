import { firebaseProvider } from '@common/providers/firebase'

const confirmUserFn = firebaseProvider.FUNCTION_CALL<string>('confirmUser')

export async function confirmUserUseCase(uid: string) {
    await confirmUserFn(uid)
}
