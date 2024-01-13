import UploadReport from './components/UploadReport'
import { formatDiamonds } from '@common/helpers/formatDiamonds'
import { formatDuration } from '@common/helpers/formatDuration'
import { getErrorMessage } from '@common/helpers/getErrorMessage'
import { useAuthenticationContext } from '@contexts/auth/useAuthenticationContext'
import { useAuthenticatedRoute } from '@hooks/auth/useAuthenticatedRoute'
import { useValidatedClaim } from '@hooks/auth/useValidatedClaim'
import DebounceSelect from '@molecule/DebounceSelect'
import DashboardContainer from '@organism/DashboardContainer'
import { getReportsUseCase } from '@useCases/reports/getReports'
import { getUsersUseCase } from '@useCases/user/getUsers'
import { Alert, Button, DatePicker, Form, Table, Typography } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { IDateRange, IUser } from 'oitoselo-models'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'

const INITIAL_DATE_RANGE: IDateRange = {
    from: dayjs().subtract(6, 'd').startOf('day').toISOString(),
    to: dayjs().endOf('day').toISOString(),
}

interface ISelectVelue extends IUser {
    key: string
    label: string
    value: string
}

async function getUsers(search: string): Promise<ISelectVelue[]> {
    const { items: users } = await getUsersUseCase({ search })

    return users.map((user) => ({
        ...user,
        key: user.id,
        label: user.displayName,
        value: user.id,
    }))
}

interface IReportFilter {
    dateRange: IDateRange
    users: ISelectVelue[]
}

interface IReportFilterForm {
    dateRange: [Dayjs, Dayjs]
    users: ISelectVelue[]
}

const initialFormData: IReportFilterForm = {
    dateRange: [dayjs(INITIAL_DATE_RANGE.from), dayjs(INITIAL_DATE_RANGE.to)],
    users: [],
}

const Reports: React.FC = () => {
    const navigate = useNavigate()
    const loggedUser = useAuthenticationContext((context) => context.authetication?.user)
    const isAdminUser = useValidatedClaim('claims_admin')
    const [filter, setFilter] = useState<IReportFilter>({
        dateRange: INITIAL_DATE_RANGE,
        users: [],
    })

    useAuthenticatedRoute()

    const { data, isLoading, error } = useSWR(
        () => (loggedUser ? JSON.stringify(filter) : null),
        () => getReportsUseCase({ dateRange: filter.dateRange, uids: filter.users.map((u) => u.value) })
    )

    const handleSubmitForm = ({ dateRange, users }: IReportFilterForm) => {
        setFilter({
            dateRange: {
                from: dayjs(dateRange[0]).startOf('d').toISOString(),
                to: dayjs(dateRange[1]).endOf('d').toISOString(),
            },
            users,
        })
    }

    if (!isAdminUser)
        return (
            <DashboardContainer>
                <Alert showIcon type="warning" message="Você não permissão para acessar essa página" />
            </DashboardContainer>
        )

    const users = data?.flat() || []

    return (
        <DashboardContainer>
            <div className="flex justify-between">
                <Form
                    onFinish={handleSubmitForm}
                    disabled={isLoading}
                    className="flex gap-4 mb-5 w-auto"
                    initialValues={initialFormData}
                >
                    {isAdminUser && (
                        <Form.Item<IReportFilterForm> name="users">
                            <DebounceSelect
                                placeholder="Usuários"
                                fetcher={getUsers}
                                className="min-w-[250px]"
                                mode="multiple"
                            />
                        </Form.Item>
                    )}
                    <Form.Item<IReportFilterForm>
                        name="dateRange"
                        rules={[
                            {
                                required: true,
                                message: 'Seleciona um período',
                            },
                        ]}
                    >
                        <DatePicker.RangePicker format="DD/MM/YYYY" />
                    </Form.Item>
                    <Button loading={isLoading} type="primary" htmlType="submit">
                        Filtrar
                    </Button>
                </Form>
                <div className="flex gap-4">
                    <Button onClick={() => navigate('/unassigned-reports')}>Relatórios não atribuídos</Button>
                    {isAdminUser && <UploadReport />}
                </div>
            </div>
            {error ? (
                <Alert type="error" message={getErrorMessage(error)} />
            ) : (
                <Table
                    title={() => <Typography className="font-bold">Relatório</Typography>}
                    columns={[
                        {
                            title: 'Nome',
                            dataIndex: 'displayName',
                        },
                        {
                            title: 'Username (TikTok)',
                            width: 250,
                            dataIndex: 'username',
                            render: (username, record) => (
                                <Button onClick={() => navigate(`/reports/${record.userId}`)} type="link">
                                    {username}
                                </Button>
                            ),
                        },
                        {
                            title: 'Número de dias',
                            dataIndex: 'numberOfDays',
                        },
                        {
                            title: 'Duração',
                            dataIndex: 'duration',
                            render: (value: number) => formatDuration(value),
                            sorter: { compare: (a, b) => a.duration - b.duration, multiple: 1 },
                            defaultSortOrder: 'descend',
                        },
                        {
                            title: 'Diamantes',
                            dataIndex: 'diamonds',
                            render: (value: number) => formatDiamonds(value),
                            sorter: { compare: (a, b) => a.diamonds - b.diamonds, multiple: 2 },
                            defaultSortOrder: 'descend',
                        },
                    ]}
                    rowKey={(value) => value.userId || ''}
                    loading={isLoading}
                    dataSource={users}
                    pagination={false}
                />
            )}
        </DashboardContainer>
    )
}

export default Reports
