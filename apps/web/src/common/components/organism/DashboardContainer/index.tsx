import { DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import logoOitoSelo from '@assets/images/logo-oitoselo.png'
import Container from '@common/components/atom/Container'
import { useAuthenticationContext } from '@contexts/auth/useAuthenticationContext'
import { useValidatedClaim } from '@hooks/auth/useValidatedClaim'
import MenuItem from '@molecule/MenuItem'
import { logUserOutUseCase } from '@useCases/auth/logUserOut'
import { Button, Dropdown, Flex, Layout, MenuProps, theme } from 'antd'
import { PropsWithChildren } from 'react'
import { useNavigate } from 'react-router-dom'

const DashboardContainer: React.FC<PropsWithChildren> = ({ children }) => {
    const navigate = useNavigate()
    const isAdminUser = useValidatedClaim('claims_admin')
    const {
        token: { colorBgContainer, sizeMD, sizeSM },
    } = theme.useToken()

    const user = useAuthenticationContext((auth) => auth.authetication?.user)

    const items: MenuProps['items'] = [
        { key: 'account', label: 'Conta', icon: <UserOutlined />, onClick: () => navigate('/account') },
        { key: 'logout', label: 'Logout', icon: <LogoutOutlined />, onClick: () => logUserOutUseCase() },
    ]

    return (
        <Layout>
            <Layout.Header>
                <Container className="h-full">
                    <Flex className="flex-row items-center justify-between h-full">
                        <div className="flex items-center gap-3">
                            <img src={logoOitoSelo} title="Oitoselo" alt="Oitoselo" height={35} />
                            {isAdminUser && (
                                <>
                                    <MenuItem label="Usuários" to="/users" />
                                    <MenuItem label="Relatórios" to="/reports" />
                                </>
                            )}
                        </div>
                        {!!user && (
                            <div className="flex items-center">
                                <Dropdown menu={{ items }} trigger={['click']} arrow placement="topRight">
                                    <Flex className="flex-row " gap={10}>
                                        <Button type="link">
                                            Olá, {user.displayName}
                                            <DownOutlined />
                                        </Button>
                                    </Flex>
                                </Dropdown>
                            </div>
                        )}
                    </Flex>
                </Container>
            </Layout.Header>
            <Layout.Content className="p-12">
                <Container>
                    <Layout style={{ backgroundColor: colorBgContainer, borderRadius: sizeSM }}>
                        <Layout.Content style={{ padding: sizeMD }}>{children}</Layout.Content>
                    </Layout>
                </Container>
            </Layout.Content>
        </Layout>
    )
}

export default DashboardContainer
