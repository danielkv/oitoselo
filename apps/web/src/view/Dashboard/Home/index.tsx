import { useAuthenticatedRoute } from '@hooks/auth/useAuthenticatedRoute'
import DashboardContainer from '@organism/DashboardContainer'

const Home: React.FC = () => {
    useAuthenticatedRoute()

    return <DashboardContainer>Home</DashboardContainer>
}

export default Home
