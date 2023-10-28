import { firebaseProvider } from '@common/providers/firebase'

type TAction = 'enable' | 'disable'

const enableDisableUserFn = firebaseProvider.FUNCTION_CALL<{ uid: string; action: TAction }>('enableDisableUser')

export async function enableDisableUserUseCase(uid: string, action: TAction) {
    await enableDisableUserFn({ uid, action })
}
