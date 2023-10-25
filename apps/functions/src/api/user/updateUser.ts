import { init } from '../../helpers/init'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { https } from 'firebase-functions'
import { pick } from 'radash'

init()

export const updateUser = https.onCall(
    async ({ uid, data }: { uid: string; data: Partial<Record<string, any>> }, context) => {
        const fs = getFirestore()

        try {
            if (!context.auth?.token.admin && uid !== context.auth?.uid)
                throw new Error('User does not have permission')

            const normalizedData = pick(data, ['displayName', 'email', 'photoURL', 'phoneNumber', 'username'])
            const auth = getAuth()
            await auth.updateUser(uid, normalizedData)

            await fs.collection('user_data').doc(uid).update(normalizedData)
        } catch (err: any) {
            throw new https.HttpsError('unknown', err.code, { message: err.message, code: err.code })
        }
    }
)
