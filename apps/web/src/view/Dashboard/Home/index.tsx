import UserReport from '../UserReport'
import { useAuthenticationContext } from '@contexts/auth/useAuthenticationContext'
import { useAuthenticatedRoute } from '@hooks/auth/useAuthenticatedRoute'
import { useValidatedClaim } from '@hooks/auth/useValidatedClaim'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Home: React.FC = () => {
    useAuthenticatedRoute()
    const loggedUser = useAuthenticationContext((ctx) => ctx.authetication?.user)
    const isAdminUser = useValidatedClaim('claims_admin')
    const navigate = useNavigate()

    useEffect(() => {
        if (loggedUser && isAdminUser) navigate('/users')
    }, [isAdminUser, loggedUser])

    return <UserReport />
}

export default Home
