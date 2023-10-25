import { firebaseProvider } from '@common/providers/firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { IUser, IUserInput } from 'oitoselo-models'
import { userConverter } from 'oitoselo-utils'
import { omit, pick } from 'radash'

const db = firebaseProvider.firestore()

export async function createUserUseCase(data: IUserInput): Promise<IUser> {
    const userCredentials = await createUserWithEmailAndPassword(firebaseProvider.getAuth(), data.email, data.password)
    const dataToSaveInAuth = pick(data, ['displayName', 'photoURL'])
    await updateProfile(userCredentials.user, dataToSaveInAuth)

    const dataToSaveInDb = omit(data, ['password'])
    const docRef = db.doc('users', userCredentials.user.uid).withConverter(userConverter)
    await db.setDoc(docRef, dataToSaveInDb)

    return {
        id: userCredentials.user.uid,
        displayName: data.displayName,
        username: data.username,
        email: data.email,
        phoneNumber: userCredentials.user.phoneNumber || '',
        photoURL: userCredentials.user.phoneNumber || '',
    }
}
