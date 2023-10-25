import { init } from '../../helpers/init'
import { getFirestore } from 'firebase-admin/firestore'
import { auth } from 'firebase-functions'
import { pick } from 'radash'

init()

export const copyUserDataToCollection = auth.user().onCreate((user) => {
    const fs = getFirestore()

    const userData = pick(user, ['uid', 'displayName', 'email', 'photoURL', 'phoneNumber'])

    return fs.collection('users').doc(user.uid).create(userData)
})
