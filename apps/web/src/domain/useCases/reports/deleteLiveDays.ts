import { firebaseProvider } from '@common/providers/firebase'

export async function deleteLiveDaysUseCase(ids: string[]) {
    const db = firebaseProvider.firestore()
    const batch = db.writeBatch(firebaseProvider.getFirestore())

    ids.forEach((id) => {
        const docRef = db.doc('lives', id)
        batch.delete(docRef)
    })

    await batch.commit()
}
