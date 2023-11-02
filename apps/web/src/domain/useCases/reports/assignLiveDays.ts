import { firebaseProvider } from '@common/providers/firebase'

export async function assignLiveDaysUseCase(liveIds: string[], userId: string) {
    const db = firebaseProvider.firestore()
    const batch = db.writeBatch(firebaseProvider.getFirestore())

    liveIds.forEach((id) => {
        const docRef = db.doc('lives', id)
        batch.update(docRef, { uid: userId })
    })

    await batch.commit()
}
