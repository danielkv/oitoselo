import { getErrorMessage } from '@common/helpers/getErrorMessage'
import { supabase } from '@common/providers/supabase'
import { useAuthenticationContext } from '@contexts/auth/useAuthenticationContext'
import { User } from '@supabase/supabase-js'
import { getAuthenticationContextUseCase } from '@useCases/auth/getAuthenticationContext'
import { Modal } from 'antd'
import { useEffect, useState } from 'react'

const setAuthetication = useAuthenticationContext.getState().setAuthetication

export function useAuthConfig() {
    const [loading, setLoading] = useState(true)

    async function onAuthStateReady() {
        await supabase.auth.initialize()

        const {
            data: { session },
            error,
        } = await supabase.auth.getSession()
        if (error) throw error

        await handleAuthStateChanged(session?.user)

        setLoading(false)
    }

    async function handleAuthStateChanged(authUser?: User | null) {
        try {
            if (!authUser?.email) return setAuthetication(null)

            const authContext = getAuthenticationContextUseCase(authUser)

            setAuthetication(authContext)
        } catch (err) {
            Modal.error({ title: 'Ocorreu um erro', content: getErrorMessage(err) })
        }
    }

    useEffect(() => {
        onAuthStateReady().catch((err) => {
            Modal.error({ title: 'Ocorreu um erro', content: getErrorMessage(err) })
        })
    }, [])

    useEffect(() => {
        if (loading) return

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_, session) => handleAuthStateChanged(session?.user))

        return () => subscription.unsubscribe()
    }, [loading])

    return { loading }
}
