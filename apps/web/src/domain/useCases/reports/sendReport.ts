import { firebaseProvider } from '@common/providers/firebase'
import { UploadFile } from 'antd'
import { RcFile } from 'antd/lib/upload'

interface ISendReportUseCase {
    date: string
    file: UploadFile
}

export async function sendReportUseCase({ file, date }: ISendReportUseCase) {
    const token = await firebaseProvider.getAuth().currentUser?.getIdToken()
    if (!token) throw new Error('Nenhum usuário logado')

    const formData = new FormData()
    formData.append('file', file as RcFile)
    formData.append('date', date)

    const baseUrl = import.meta.env.VITE_APP_BASE_URL
    const endpoint = `/spreadsheetUpload?auth=${token}`

    await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        body: formData,
    })
}
