import RowActions from './components/RowActions'
import { SearchOutlined } from '@ant-design/icons'
import { getErrorMessage } from '@common/helpers/getErrorMessage'
import { useAuthenticatedRoute } from '@hooks/auth/useAuthenticatedRoute'
import { useValidatedClaim } from '@hooks/auth/useValidatedClaim'
import DashboardContainer from '@organism/DashboardContainer'
import { getUnconfirmedUsersUseCase } from '@useCases/user/getUnconfirmedUsers'
import { getUsersUseCase } from '@useCases/user/getUsers'
import { Alert, Button, Collapse, Form, Input, Table, Typography } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'

const DEFAULT_PAGE_SIZE = 10

const Users: React.FC = () => {
    const navigate = useNavigate()
    const isAdminUser = useValidatedClaim('claims_admin')
    useAuthenticatedRoute()

    const [size, setSize] = useState(0)
    const [search, setSearch] = useState('')

    const getKey = (): [string, number, number] | null => {
        if (!isAdminUser) return null

        return [search, DEFAULT_PAGE_SIZE, size]
    }

    const {
        data,
        isLoading,
        error,
        mutate: mutateConfirmed,
    } = useSWR(getKey, (args) => getUsersUseCase({ search: args[0], pageSize: args[1], page: args[2] }))

    const {
        data: unconfirmedUsers,
        isLoading: loadingUnconfirmed,
        mutate: mutateUnconfirmed,
    } = useSWR(() => (isAdminUser ? 'unconfirmedUsers' : null), getUnconfirmedUsersUseCase)

    if (!isAdminUser)
        return (
            <DashboardContainer>
                <Alert showIcon type="warning" message="Você não permissão para acessar essa página" />
            </DashboardContainer>
        )

    const { items: users = [], total = 0 } = data || {}

    return (
        <DashboardContainer>
            {!!unconfirmedUsers?.length && (
                <Collapse>
                    <Collapse.Panel
                        key="unconfirmed"
                        header={
                            <Typography className="font-bold text-red-700">
                                Usuários não confirmados ({unconfirmedUsers.length})
                            </Typography>
                        }
                    >
                        <Table
                            rowKey={(value) => value.id}
                            columns={[
                                { title: 'Nome', dataIndex: 'displayName' },
                                {
                                    title: 'Username (TikTok)',
                                    width: 250,
                                    dataIndex: 'username',
                                },
                                { title: 'Email', dataIndex: 'email' },
                                {
                                    title: 'Ações',
                                    width: 150,
                                    render: (row) => (
                                        <RowActions
                                            onSuccess={async () => {
                                                await mutateConfirmed()
                                                await mutateUnconfirmed()
                                            }}
                                            user={row}
                                            hideButtons={['disable', 'enable', 'promote', 'demote']}
                                        />
                                    ),
                                },
                            ]}
                            loading={loadingUnconfirmed}
                            dataSource={unconfirmedUsers}
                            pagination={false}
                        />
                    </Collapse.Panel>
                </Collapse>
            )}

            <Form
                onFinish={({ search }) => setSearch(search)}
                disabled={!!search && isLoading}
                className="flex gap-4   mt-10 mb-5 w-auto"
            >
                <Form.Item name="search" rules={[{ min: 3, message: 'Digite pelo menos 3 caracteres' }]}>
                    <Input allowClear title="Busca" placeholder="Busca" prefix={<SearchOutlined />} />
                </Form.Item>
                <Button type="primary" htmlType="submit">
                    Buscar
                </Button>
            </Form>

            {error ? (
                <Alert message={getErrorMessage(error)} />
            ) : (
                <Table
                    title={() => <Typography className="font-bold">Usuários confirmados</Typography>}
                    columns={[
                        { title: 'Nome', dataIndex: 'displayName' },
                        {
                            title: 'Username (TikTok)',
                            width: 250,
                            dataIndex: 'username',
                            render: (username: string) => (
                                <Button onClick={() => navigate(`/reports/${username}`)} type="link">
                                    {username}
                                </Button>
                            ),
                        },
                        { title: 'Email', dataIndex: 'email' },
                        {
                            title: 'Ações',
                            width: 150,
                            render: (row) => (
                                <RowActions
                                    onSuccess={async () => {
                                        await mutateConfirmed()
                                        await mutateUnconfirmed()
                                    }}
                                    user={row}
                                    hideButtons={['confirm']}
                                />
                            ),
                        },
                    ]}
                    rowKey={(value) => value.id}
                    loading={isLoading}
                    dataSource={users}
                    pagination={{
                        current: size + 1,
                        total,
                        onChange(page) {
                            setSize(page - 1)
                        },
                    }}
                />
            )}
        </DashboardContainer>
    )
}

export default Users
