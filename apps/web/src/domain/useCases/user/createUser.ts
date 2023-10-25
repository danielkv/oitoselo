import { firebaseProvider } from '@common/providers/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { IUser, IUserInput } from 'oitoselo-models'
import { pick } from 'radash'

const updateUserFn = firebaseProvider.FUNCTION_CALL<{ uid: string; data: Partial<IUser> }>('updateUser')

export async function createUserUseCase(data: IUserInput): Promise<IUser> {
    const userCredentials = await createUserWithEmailAndPassword(firebaseProvider.getAuth(), data.email, data.password)

    const dataToUpdate = pick(data, ['displayName', 'username'])

    await updateUserFn({ uid: userCredentials.user.uid, data: dataToUpdate })

    return {
        uid: userCredentials.user.uid,
        displayName: data.displayName,
        username: data.username,
        email: data.email,
        phoneNumber: userCredentials.user.phoneNumber || '',
        photoURL: userCredentials.user.phoneNumber || '',
    }
}
