import { LockOutlined, MailOutlined, PhoneOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons'
import { getErrorMessage } from '@common/helpers/getErrorMessage'
import { createUserUseCase } from '@useCases/user/createUser'
import { Button, Card, Flex, Form, Input, Layout, Modal } from 'antd'
import { IUserInput } from 'oitoselo-models'
import { omit } from 'radash'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface ISubscriptionForm extends IUserInput {
    repeatPassword: string
}

const Subscription: React.FC = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

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
                        <Form.Item<ISubscriptionForm>
                            name="displayName"
                            label="Nome completo"
                            rules={[{ required: true, message: 'Nome é obrigatório' }]}
                        >
                            <Input prefix={<UserOutlined />} />
                        </Form.Item>
                        <Form.Item<ISubscriptionForm>
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Email é obrigatório' },
                                { type: 'email', message: 'Email inválido' },
                            ]}
                        >
                            <Input prefix={<MailOutlined />} />
                        </Form.Item>
                        <Form.Item<ISubscriptionForm>
                            name="phoneNumber"
                            label="Telefone"
                            rules={[{ required: true, message: 'Email é obrigatório' }]}
                        >
                            <Input type="phone" prefix={<PhoneOutlined />} />
                        </Form.Item>
                        <Form.Item<ISubscriptionForm>
                            name="username"
                            label="Username (tiktok)"
                            rules={[{ required: true, message: 'Email é obrigatório' }]}
                        >
                            <Input type="phone" prefix={<UserAddOutlined />} />
                        </Form.Item>
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
