import { firebaseProvider } from '@common/providers/firebase'
import { IUser } from 'oitoselo-models'

const updateUserFn = firebaseProvider.FUNCTION_CALL<{ uid: string; data: Partial<IUser> }>('updateUser')

export async function updateUserUseCase(uid: string, data: Partial<IUser>): Promise<void> {
    await updateUserFn({ uid, data })
}
