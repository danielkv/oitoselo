import { init } from '../../helpers/init'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { https } from 'firebase-functions'

init()

export const promoteUserToAdmin = https.onCall(async (uid: string, context) => {
    try {
        if (!context.auth?.token.admin) throw new Error('User does not have permission')

        // UPDATE AUTH USER
        const auth = getAuth()
        await auth.setCustomUserClaims(uid, { admin: true })

        // UPDATE DB USER
        const db = getFirestore()
        const docRef = db.collection('users').doc(uid)
        const userSnapshot = await docRef.get()
        const userData = userSnapshot.data()

        if (!userSnapshot.exists || !userData) throw new Error('User does not exists')
        userData.claims = { ...userData.claims, admin: true }
        await db.collection('users').doc(uid).update(userData)
    } catch (err: any) {
        throw new https.HttpsError('unknown', err.code, { message: err.message, code: err.code })
    }
})
