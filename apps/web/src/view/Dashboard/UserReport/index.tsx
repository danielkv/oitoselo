import { formatDiamonds } from '@common/helpers/formatDiamonds'
import { formatDuration } from '@common/helpers/formatDuration'
import { getErrorMessage } from '@common/helpers/getErrorMessage'
import { useAuthenticationContext } from '@contexts/auth/useAuthenticationContext'
import { useAuthenticatedRoute } from '@hooks/auth/useAuthenticatedRoute'
import { useValidatedClaim } from '@hooks/auth/useValidatedClaim'
import DashboardContainer from '@organism/DashboardContainer'
import { getReportByUsernameUseCase } from '@useCases/reports/getReportByUsername'
import { Alert, Button, Card, Col, DatePicker, Form, Row, Statistic, Typography } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { IDateRange } from 'oitoselo-models'
import { useState } from 'react'
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
    useAuthenticatedRoute((claims) => claims.userConfirmed || claims.admin)
    const loggedUser = useAuthenticationContext((context) => context.authetication?.user)
    const isUserAdmin = useValidatedClaim('admin')
    const { username: usernameParam } = useParams()

    const username = (isUserAdmin && usernameParam ? usernameParam : loggedUser?.username) || ''

    const [filter, setFilter] = useState<IReportFilter>({
        dateRange: INITIAL_DATE_RANGE,
    })

    const { data, isLoading, error } = useSWR(
        () => (loggedUser && username ? [JSON.stringify(filter), username] : null),
        () =>
            getReportByUsernameUseCase({
                dateRange: filter.dateRange,
                username,
            })
    )

    const handleSubmitForm = ({ dateRange }: IReportFilterForm) => {
        setFilter({
            dateRange: {
                from: dayjs(dateRange[0]).startOf('d').toISOString(),
                to: dayjs(dateRange[1]).endOf('d').toISOString(),
            },
        })
    }

    return (
        <DashboardContainer>
            <div className="flex justify-between">
                <Form
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
            {error ? (
                <Alert type="error" message={getErrorMessage(error)} />
            ) : (
                <>
                    <div className="mb-8">
                        <Typography.Title className="text-center !mb-0">{data?.displayName}</Typography.Title>
                        <Typography.Title level={3} className="text-center !mt-0">
                            {data?.username}
                        </Typography.Title>
                    </div>
                    <Row justify="center">
                        <Col xs={24} md={4}>
                            <Card className="bg-slate-800" bordered={false}>
                                <Statistic
                                    title={<Typography className="text-white">Duração</Typography>}
                                    valueStyle={{ color: 'white' }}
                                    className="text-center"
                                    value={data?.duration}
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
                                    value={data?.diamonds}
                                    formatter={(value) => formatDiamonds(value as number)}
                                />
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </DashboardContainer>
    )
}

export default UserReport
