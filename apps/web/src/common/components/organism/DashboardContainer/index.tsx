import logoOitoSelo from '@assets/images/logo-oitoselo.png'
import MenuItem from '@molecule/MenuItem'
import { Flex, Image, Layout, theme } from 'antd'
import { PropsWithChildren } from 'react'

const DashboardContainer: React.FC<PropsWithChildren> = ({ children }) => {
    const {
        token: { colorBgContainer, sizeMD, sizeSM },
    } = theme.useToken()

    return (
        <Layout>
            <Layout.Header>
                <Flex className="flex-row items-center gap-3">
                    <Image preview={false} src={logoOitoSelo} height={35} />
                    <MenuItem label="Usuários" to="" />
                    <MenuItem label="Relatórios" to="" />
                </Flex>
            </Layout.Header>
            <Layout.Content className="p-12">
                <Layout style={{ backgroundColor: colorBgContainer, borderRadius: sizeSM }}>
                    <Layout.Content style={{ padding: sizeMD }}>{children}</Layout.Content>
                </Layout>
            </Layout.Content>
        </Layout>
    )
}

export default DashboardContainer
