import UserMainFormFields from './components/UserMainFormFields'
import { ISubscriptionForm } from './types'
import { LockOutlined } from '@ant-design/icons'
import { getErrorMessage } from '@common/helpers/getErrorMessage'
import { useAuthenticatedRedirect } from '@hooks/auth/useAuthenticatedRedirect'
import { createUserUseCase } from '@useCases/user/createUser'
import { Button, Card, Flex, Form, Input, Layout, Modal } from 'antd'
import { omit } from 'radash'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Subscription: React.FC = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    useAuthenticatedRedirect()

    const handleSubmit = async (values: ISubscriptionForm) => {
        setLoading(true)
        try {
            const normalizedValues = omit(values, ['repeatPassword'])

            await createUserUseCase(normalizedValues)

            navigate('/')
        } catch (err) {
            Modal.error({ title: 'Ocorreu um erro', content: getErrorMessage(err) })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout>
            <Flex align="center" justify="center" flex={1}>
                <Card title="Preencha os dados abaixo para se cadastrar" className="w-[500px] max-w-[90%]">
                    <Form disabled={loading} layout="vertical" name="login" onFinish={handleSubmit}>
                        <UserMainFormFields />
                        <Form.Item<ISubscriptionForm>
                            name="password"
                            label="Senha"
                            rules={[
                                { required: true, message: 'Senha é obrigatória' },
                                { min: 6, message: 'A senha deve ter no mínimo 6 caracteres' },
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} />
                        </Form.Item>
                        <Form.Item<ISubscriptionForm>
                            name="repeatPassword"
                            label="Repetir senha"
                            rules={[
                                { required: true, message: 'Repetir a senha é obrigatória' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve()
                                        }
                                        return Promise.reject(new Error('A senhas não são iguais'))
                                    },
                                }),
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} />
                        </Form.Item>
                        <Form.Item>
                            <Button loading={loading} type="primary" htmlType="submit">
                                Cadastrar
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Flex>
        </Layout>
    )
}

export default Subscription
