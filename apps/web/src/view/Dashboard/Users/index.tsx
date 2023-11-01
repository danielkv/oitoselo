import RowActions from './components/RowActions'
import { SearchOutlined } from '@ant-design/icons'
import { getErrorMessage } from '@common/helpers/getErrorMessage'
import { useAuthenticatedRoute } from '@hooks/auth/useAuthenticatedRoute'
import { useValidatedClaim } from '@hooks/auth/useValidatedClaim'
import CursorPagination from '@molecule/CursorPagination'
import DashboardContainer from '@organism/DashboardContainer'
import { getUnconfirmedUsersUseCase } from '@useCases/user/getUnconfirmedUsers'
import { getUsersUseCase } from '@useCases/user/getUsers'
import { Alert, Button, Collapse, Form, Input, Table, Typography } from 'antd'
import { IUser } from 'oitoselo-models'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'

const DEFAULT_PAGE_SIZE = 10

const Users: React.FC = () => {
    const navigate = useNavigate()
    const isAdminUser = useValidatedClaim('admin')
    useAuthenticatedRoute()

    const [endReached, setEndReached] = useState(false)
    const [search, setSearch] = useState('')

    const getKey = (pageIndex: number, previousPageData: IUser[]): [string, number, string | null, number] | null => {
        if (!isAdminUser) return null
        if (previousPageData && !previousPageData.length) return null

        const previousLastItem = previousPageData?.[previousPageData.length - 1].id

        return [search, DEFAULT_PAGE_SIZE, pageIndex === 0 ? null : previousLastItem, pageIndex]
    }

    const {
        data,
        isLoading,
        isValidating,
        error,
        size,
        setSize,
        mutate: mutateConfirmed,
    } = useSWRInfinite(getKey, (args) => getUsersUseCase({ search: args[0], limit: args[1], lastUserId: args[2] }), {
        onSuccess(data) {
            if (data && !data.at(-1)?.length) setEndReached(true)
            else if (endReached) setEndReached(false)
        },
    })

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

    const users = data ? data[data.length - 1] : []

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
                    pagination={false}
                    footer={() => (
                        <CursorPagination
                            loading={isValidating}
                            setPage={setSize}
                            currentPage={size}
                            nextDisabled={endReached || users.length < DEFAULT_PAGE_SIZE}
                            prevDisabled={size <= 1}
                        />
                    )}
                />
            )}
        </DashboardContainer>
    )
}

export default Users
