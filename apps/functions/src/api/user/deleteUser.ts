import { init } from '../../helpers/init'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { https } from 'firebase-functions'

init()

export const deleteUser = https.onCall(async (uid: string, context) => {
    try {
        if (!context.auth?.token.admin) throw new Error('User does not have permission')

        // UPDATE AUTH USER
        const auth = getAuth()
        await auth.deleteUser(uid)

        // UPDATE DB USER
        const db = getFirestore()
        const docRef = db.collection('users').doc(uid)
        await docRef.delete()
    } catch (err: any) {
        throw new https.HttpsError('unknown', err.code, { message: err.message, code: err.code })
    }
})
