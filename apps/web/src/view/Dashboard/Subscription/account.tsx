import UserMainFormFields from './components/UserMainFormFields'
import { ISubscriptionForm } from './types'
import { getErrorMessage } from '@common/helpers/getErrorMessage'
import { useAuthenticationContext } from '@contexts/auth/useAuthenticationContext'
import DashboardContainer from '@organism/DashboardContainer'
import { getLoggedUser } from '@useCases/user/getLoggedUser'
import { updateLoggedUserUseCase } from '@useCases/user/updateUser'
import { Button, Form, Layout, Modal, Spin, message } from 'antd'
import { useState } from 'react'
import useSWR from 'swr'

const Account: React.FC = () => {
    const authetication = useAuthenticationContext((context) => context.authetication)
    const { data: user, isLoading, mutate } = useSWR(() => (authetication ? 'getLoggedUser' : null), getLoggedUser)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (values: ISubscriptionForm) => {
        setLoading(true)
        try {
            const normalizedValues = values

            await updateLoggedUserUseCase(normalizedValues)

            message.success({ content: 'Conta atualizada' })
            mutate()
        } catch (err) {
            Modal.error({ title: 'Ocorreu um erro', content: getErrorMessage(err) })
        } finally {
            setLoading(false)
        }
    }

    if (isLoading)
        return (
            <DashboardContainer>
                <div className="flex justify-center items-center flex-1">
                    <Spin />
                </div>
            </DashboardContainer>
        )

    if (!user) return null

    return (
        <DashboardContainer>
            <Layout className="bg-white max-w-screen-sm m-auto">
                <Form initialValues={user} disabled={loading} layout="vertical" name="login" onFinish={handleSubmit}>
                    <UserMainFormFields />

                    <Form.Item>
                        <Button loading={loading} type="primary" htmlType="submit">
                            Salvar
                        </Button>
                    </Form.Item>
                </Form>
            </Layout>
        </DashboardContainer>
    )
}

export default Account
