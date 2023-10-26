import { getErrorMessage } from '@common/helpers/getErrorMessage'
import { firebaseProvider } from '@common/providers/firebase'
import { useAuthenticationContext } from '@contexts/auth/useAuthenticationContext'
import { getAuthenticationContextUseCase } from '@useCases/auth/getAuthenticationContext'
import { Modal } from 'antd'
import { User } from 'firebase/auth'
import { useEffect } from 'react'

const setAuthetication = useAuthenticationContext.getState().setAuthetication
const { error } = Modal

export function useConfig() {
    async function handleAuthStateChanged(authUser: User | null) {
        try {
            if (!authUser || !authUser?.email) return setAuthetication(null)

            const authContext = await getAuthenticationContextUseCase(authUser)

            setAuthetication(authContext)
        } catch (err) {
            error({ title: 'Ocorreu um erro', content: getErrorMessage(err) })
        }
    }

    useEffect(() => {
        const unsubscribe = firebaseProvider.getAuth().onAuthStateChanged(handleAuthStateChanged)

        return () => unsubscribe()
    }, [])
}
