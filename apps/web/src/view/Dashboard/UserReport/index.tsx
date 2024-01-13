import RowActions from './components/RowActions'
import { formatDiamonds } from '@common/helpers/formatDiamonds'
import { formatDuration } from '@common/helpers/formatDuration'
import { getErrorMessage } from '@common/helpers/getErrorMessage'
import { reduceDaysToReport } from '@common/helpers/reduceDaysToReport'
import { useAuthenticationContext } from '@contexts/auth/useAuthenticationContext'
import { useAuthenticatedRoute } from '@hooks/auth/useAuthenticatedRoute'
import { useValidatedClaim } from '@hooks/auth/useValidatedClaim'
import DashboardContainer from '@organism/DashboardContainer'
import { getAssignedLiveDaysUseCase } from '@useCases/reports/getAssignedLiveDays'
import { Alert, Button, Card, Col, DatePicker, Form, Row, Statistic, Table, Typography } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { IDateRange, ILiveReportRow } from 'oitoselo-models'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import useSWR from 'swr'

const INITIAL_DATE_RANGE: IDateRange = {
    from: dayjs().subtract(6, 'd').startOf('day').toISOString(),
    to: dayjs().endOf('day').toISOString(),
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

const UserReport: React.FC = () => {
    useAuthenticatedRoute()
    const loggedUser = useAuthenticationContext((context) => context.authetication?.user)
    const isUserAdmin = useValidatedClaim('claims_admin')
    const isConfirmed = useValidatedClaim('userrole', 'default')
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)

    const { userId: userIdParam } = useParams()

    const userId = (isUserAdmin && userIdParam ? userIdParam : loggedUser?.id) || ''

    const [filter, setFilter] = useState<IReportFilter>({
        dateRange: INITIAL_DATE_RANGE,
    })

    const {
        data: reportDays,
        isLoading: isLoadingReportDays,
        mutate: mutateReportDays,
        error,
    } = useSWR(
        () => (isConfirmed && loggedUser && userId ? [JSON.stringify(filter), userId, loggedUser.id] : null),
        () =>
            getAssignedLiveDaysUseCase({
                dateRange: filter.dateRange,
                userId: loggedUser?.id || '',
            })
    )

    const reducedDays = useMemo(
        () => (reportDays ? reduceDaysToReport(reportDays.items) : {}) as Omit<ILiveReportRow, 'numberOfDays'>,
        [reportDays?.items]
    )

    const handleSubmitForm = ({ dateRange }: IReportFilterForm) => {
        setFilter({
            dateRange: {
                from: dayjs(dateRange[0]).startOf('d').toISOString(),
                to: dayjs(dateRange[1]).endOf('d').toISOString(),
            },
        })
    }

    if (!isConfirmed)
        return (
            <DashboardContainer>
                <Alert showIcon type="warning" message="Você não permissão para acessar essa página" />
            </DashboardContainer>
        )

    return (
        <DashboardContainer>
            <div className="flex justify-between">
                <Form
                    onFinish={handleSubmitForm}
                    disabled={isLoadingReportDays}
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
                    <Button loading={isLoadingReportDays} type="primary" htmlType="submit">
                        Filtrar
                    </Button>
                </Form>
            </div>
            {error ? (
                <Alert type="error" message={getErrorMessage(error)} />
            ) : (
                <>
                    <div className="mb-8">
                        {reducedDays?.displayName && (
                            <Typography.Title className="text-center !mb-0">
                                {reducedDays?.displayName}
                            </Typography.Title>
                        )}
                        <Typography.Title level={3} className="text-center !mt-0">
                            {reportDays?.items.map((item) => item.username).join(', ')}
                        </Typography.Title>
                    </div>
                    <Row justify="center">
                        <Col xs={24} md={4}>
                            <Card className="bg-slate-800" bordered={false}>
                                <Statistic
                                    title={<Typography className="text-white">Duração</Typography>}
                                    valueStyle={{ color: 'white' }}
                                    className="text-center"
                                    value={reducedDays?.duration}
                                    formatter={(value) => formatDuration(value as number)}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} md={{ span: 4, offset: 1 }}>
                            <Card className="bg-slate-800" bordered={false}>
                                <Statistic
                                    title={<Typography className="text-white">Diamantes</Typography>}
                                    valueStyle={{ color: 'white' }}
                                    className="text-center"
                                    value={reducedDays?.diamonds}
                                    formatter={(value) => formatDiamonds(value as number)}
                                />
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
            {!isLoadingReportDays && (
                <Table
                    title={() => <Typography className="font-bold">Dias</Typography>}
                    pagination={{
                        onChange(page, pageSize) {
                            setPage(page - 1)
                            setPageSize(pageSize)
                        },

                        current: page + 1,
                        total: reportDays?.total,
                        pageSize: pageSize,
                        showTotal: (total) => `Total ${total} items`,
                    }}
                    columns={[
                        {
                            title: 'Data',
                            dataIndex: 'date',
                            render: (value: number) => dayjs(value).format('DD/MM/YYYY'),
                            //sorter: { compare: (a, b) => dayjs(a.date).diff(b.date, 'd'), multiple: 1 },
                        },
                        {
                            title: 'Username (TikTok)',
                            dataIndex: 'username',
                        },
                        {
                            title: 'Duração',
                            dataIndex: 'duration',
                            render: (value: number) => formatDuration(value),
                            ///sorter: { compare: (a, b) => a.duration - b.duration, multiple: 1 },
                        },
                        {
                            title: 'Diamantes',
                            dataIndex: 'diamonds',
                            render: (value: number) => formatDiamonds(value),
                            //sorter: { compare: (a, b) => a.diamonds - b.diamonds, multiple: 2 },
                        },
                        {
                            title: '',
                            width: 100,
                            render: (_, record) => (
                                <RowActions
                                    record={record}
                                    onSuccess={() => {
                                        mutateReportDays()
                                    }}
                                />
                            ),
                        },
                    ]}
                    rowKey={(value) => value.id}
                    loading={isLoadingReportDays}
                    dataSource={reportDays?.items || []}
                />
            )}
        </DashboardContainer>
    )
}

export default UserReport
