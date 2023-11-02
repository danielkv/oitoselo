import RowActions from './components/RowActions'
import { DeleteOutlined } from '@ant-design/icons'
import { formatDiamonds } from '@common/helpers/formatDiamonds'
import { formatDuration } from '@common/helpers/formatDuration'
import { getErrorMessage } from '@common/helpers/getErrorMessage'
import { useAuthenticationContext } from '@contexts/auth/useAuthenticationContext'
import { useAuthenticatedRoute } from '@hooks/auth/useAuthenticatedRoute'
import { useValidatedClaim } from '@hooks/auth/useValidatedClaim'
import DebounceSelect from '@molecule/DebounceSelect'
import DashboardContainer from '@organism/DashboardContainer'
import { assignLiveDaysUseCase } from '@useCases/reports/assignLiveDays'
import { deleteLiveDaysUseCase } from '@useCases/reports/deleteLiveDays'
import { getUnassignedLiveReportsUseCase } from '@useCases/reports/getUnassignedLiveReports'
import { getUsersUseCase } from '@useCases/user/getUsers'
import { Alert, Button, DatePicker, Form, Modal, Table, Typography, message } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { IDateRange, IUser } from 'oitoselo-models'
import React, { useState } from 'react'
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
    const users = await getUsersUseCase({ search })

    return users.map((user) => ({
        ...user,
        key: user.id,
        label: user.displayName,
        value: user.id,
    }))
}

interface IBatchActionsForm {
    users: ISelectVelue[]
}

interface IReportFilter {
    dateRange: IDateRange
}

interface IReportFilterForm {
    dateRange: [Dayjs, Dayjs]
}

const initialFormData: IReportFilterForm = {
    dateRange: [dayjs(INITIAL_DATE_RANGE.from), dayjs(INITIAL_DATE_RANGE.to)],
}

const UnassignedLiveReports: React.FC = () => {
    const navigate = useNavigate()
    const [loadingAssign, setLoadingAssign] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [selectedRows, setSelectedRows] = useState<string[]>([])
    const loggedUser = useAuthenticationContext((context) => context.authetication?.user)
    const isAdminUser = useValidatedClaim('admin')
    const [filter, setFilter] = useState<IReportFilter>({
        dateRange: INITIAL_DATE_RANGE,
    })

    useAuthenticatedRoute()

    const { data, isLoading, error, mutate } = useSWR(
        () => (loggedUser ? JSON.stringify(filter) : null),
        () => getUnassignedLiveReportsUseCase({ dateRange: filter.dateRange })
    )

    const handleSubmitForm = ({ dateRange }: IReportFilterForm) => {
        setFilter({
            dateRange: {
                from: dayjs(dateRange[0]).startOf('d').toISOString(),
                to: dayjs(dateRange[1]).endOf('d').toISOString(),
            },
        })
    }

    const handleDeleteBatch = async () => {
        try {
            setLoadingDelete(true)
            await deleteLiveDaysUseCase(selectedRows)

            mutate((rows) => rows?.filter((row) => !selectedRows.includes(row.id)))

            setSelectedRows([])

            message.success('Dias excluídos')
        } catch (err) {
            Modal.error({ title: 'Ocorreu um erro', content: getErrorMessage(err) })
        } finally {
            setLoadingDelete(false)
        }
    }

    const handleAssignBatch = async (values: IBatchActionsForm) => {
        try {
            setLoadingAssign(true)
            await assignLiveDaysUseCase(selectedRows, values.users[0].value)

            mutate((rows) => rows?.filter((row) => !selectedRows.includes(row.id)))

            setSelectedRows([])

            message.success('Dias atribuídos')
        } catch (err) {
            Modal.error({ title: 'Ocorreu um erro', content: getErrorMessage(err) })
        } finally {
            setLoadingAssign(false)
        }
    }

    if (!isAdminUser)
        return (
            <DashboardContainer>
                <Alert showIcon type="warning" message="Você não permissão para acessar essa página" />
            </DashboardContainer>
        )

    return (
        <DashboardContainer>
            <div className="flex justify-between">
                <Form
                    name="filter"
                    onFinish={handleSubmitForm}
                    disabled={isLoading}
                    className="flex gap-4 mb-5 w-auto"
                    initialValues={initialFormData}
                >
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
            </div>
            <div>
                <Form
                    name="batch-actions"
                    onFinish={handleAssignBatch}
                    disabled={isLoading || !selectedRows.length}
                    className="flex gap-4 mb-5 w-auto"
                    initialValues={initialFormData}
                >
                    <Form.Item<IBatchActionsForm>
                        name="users"
                        rules={[
                            { type: 'array', required: true, message: 'Selecione 1 usuário' },
                            {
                                validator(_, value) {
                                    if (!value || value.length <= 1) {
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(new Error('Selecione apenas 1 usuário'))
                                },
                            },
                        ]}
                    >
                        <DebounceSelect
                            allowClear
                            placeholder="Usuário"
                            fetcher={getUsers}
                            className="min-w-[250px]"
                            mode="multiple"
                        />
                    </Form.Item>
                    <Button loading={loadingAssign} type="primary" htmlType="submit">
                        Atribuir selecionados
                    </Button>
                    <Button
                        loading={loadingDelete}
                        type="primary"
                        icon={<DeleteOutlined />}
                        onClick={handleDeleteBatch}
                    >
                        Excluir selecionados
                    </Button>
                </Form>
            </div>
            {error ? (
                <Alert type="error" message={getErrorMessage(error)} />
            ) : (
                <Table
                    title={() => <Typography className="font-bold">Relatórios não atribuidos</Typography>}
                    rowSelection={{
                        type: 'checkbox',
                        selectedRowKeys: selectedRows,
                        onChange(keys) {
                            setSelectedRows(keys as string[])
                        },
                    }}
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
                        {
                            title: 'Data',
                            dataIndex: 'date',
                            render: (value: number) => dayjs(value).format('DD/MM/YYYY'),
                            sorter: { compare: (a, b) => dayjs(a.date).diff(b.date, 'd'), multiple: 1 },
                        },
                        {
                            title: 'Duração',
                            dataIndex: 'duration',
                            render: (value: number) => formatDuration(value),
                            sorter: { compare: (a, b) => a.duration - b.duration, multiple: 1 },
                        },
                        {
                            title: 'Diamantes',
                            dataIndex: 'diamonds',
                            render: (value: number) => formatDiamonds(value),
                            sorter: { compare: (a, b) => a.diamonds - b.diamonds, multiple: 2 },
                        },
                        {
                            title: '',
                            render: (_, record) => (
                                <RowActions
                                    record={record}
                                    onSuccess={(record) => {
                                        mutate((rows) => rows?.filter((row) => row.id !== record.id))
                                    }}
                                />
                            ),
                        },
                    ]}
                    rowKey={(value) => value.id}
                    loading={isLoading}
                    dataSource={data}
                    pagination={false}
                />
            )}
        </DashboardContainer>
    )
}

export default UnassignedLiveReports
