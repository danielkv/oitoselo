import { formatDiamonds } from '@common/helpers/formatDiamonds'
import { formatDuration } from '@common/helpers/formatDuration'
import { getErrorMessage } from '@common/helpers/getErrorMessage'
import { useAuthenticatedRoute } from '@hooks/auth/useAuthenticatedRoute'
import DashboardContainer from '@organism/DashboardContainer'
import { getReportsUseCase } from '@useCases/reports/getReports'
import { Alert, Button, DatePicker, Form, Table, Typography } from 'antd'
import dayjs from 'dayjs'
import { IDateRange } from 'oitoselo-models'
import { useState } from 'react'
import useSWR from 'swr'

const INITIAL_DATE_RANGE: IDateRange = {
    from: dayjs().subtract(7, 'days').startOf('day').toISOString(),
    to: dayjs().endOf('day').toISOString(),
}

const Reports: React.FC = () => {
    const [uids, setUids] = useState<string[]>([])
    const [dateRange, setDateRange] = useState<IDateRange>(INITIAL_DATE_RANGE)

    useAuthenticatedRoute()

    const { data, isLoading, error } = useSWR([dateRange, uids], (args) =>
        getReportsUseCase({ dateRange: args[0], uids: args[1] })
    )

    const users = data?.flat() || []

    return (
        <DashboardContainer>
            <Form
                onFinish={({ dateRange }) =>
                    setDateRange({
                        from: dayjs(dateRange[0]).startOf('d').toISOString(),
                        to: dayjs(dateRange[1]).endOf('d').toISOString(),
                    })
                }
                disabled={isLoading}
                className="flex gap-4 mt-10 mb-5 w-auto"
            >
                <Form.Item
                    name="dateRange"
                    rules={[
                        {
                            required: true,
                            message: 'Seleciona um período',
                        },
                    ]}
                >
                    <DatePicker.RangePicker />
                </Form.Item>
                <Button loading={isLoading} type="primary" htmlType="submit">
                    Buscar
                </Button>
            </Form>

            {error ? (
                <Alert message={getErrorMessage(error)} />
            ) : (
                <Table
                    title={() => <Typography className="font-bold">Relatório</Typography>}
                    columns={[
                        { title: 'Nome', dataIndex: 'displayName' },
                        { title: 'Username (TikTok)', width: 250, dataIndex: 'username' },
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
                    rowKey={(value) => value.uid}
                    loading={isLoading}
                    dataSource={users}
                    pagination={false}
                />
            )}
        </DashboardContainer>
    )
}

export default Reports
