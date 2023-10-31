import { useAuthConfig } from '@hooks/auth/useAuthConfig'
import { Layout, Spin } from 'antd'
import { PropsWithChildren } from 'react'

const AuthConfig: React.FC<PropsWithChildren> = ({ children }) => {
    const { loading } = useAuthConfig()

    if (loading)
        return (
            <Layout>
                <div className="flex justify-center items-center flex-1">
                    <Spin />
                </div>
            </Layout>
        )

    return children
}

export default AuthConfig
