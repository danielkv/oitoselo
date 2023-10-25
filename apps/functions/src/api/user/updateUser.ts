import { init } from '../../helpers/init'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { https } from 'firebase-functions'
import { pick } from 'radash'

init()

export const updateUser = https.onCall(
    async ({ uid, data }: { uid: string; data: Partial<Record<string, any>> }, context) => {
        try {
            if (!context.auth?.token.admin && uid !== context.auth?.uid)
                throw new Error('User does not have permission')

            // UPDATE AUTH USER
            const auth = getAuth()
            const normalizedData = pick(data, ['displayName', 'email', 'photoURL', 'phoneNumber'])
            await auth.updateUser(uid, normalizedData)

            // UPDATE DB USER
            const db = getFirestore()
            const normalizedDbData = pick(data, ['displayName', 'email', 'photoURL', 'phoneNumber', 'username'])
            await db.collection('users').doc(uid).update(normalizedDbData)
        } catch (err: any) {
            throw new https.HttpsError('unknown', err.code, { message: err.message, code: err.code })
        }
    }
)
