import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { getErrorMessage } from '@common/helpers/getErrorMessage'
import { useAuthenticatedRedirect } from '@hooks/auth/useAuthenticatedRedirect'
import { logUserInUseCase } from '@useCases/auth/logUserIn'
import { Button, Card, Flex, Form, Input, Layout, Modal } from 'antd'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface ILoginForm {
    email: string
    password: string
}

const Login: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search])
    const redirectTo = queryParams.get('redirect')

    useAuthenticatedRedirect()

    const [loading, setLoading] = useState(false)

    const handleSubmit = async (values: ILoginForm) => {
        setLoading(true)
        try {
            await logUserInUseCase(values.email, values.password)
            navigate(redirectTo || '/')
        } catch (err) {
            Modal.error({ title: 'Ocorreu um erro ao logar', content: getErrorMessage(err) })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout>
            <Flex align="center" justify="center" flex={1}>
                <Card title="Faça o login para acessar" className="w-[500px] max-w-[90%]">
                    <Form disabled={loading} layout="vertical" name="login" onFinish={handleSubmit}>
                        <Form.Item<ILoginForm>
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Email é obrigatório' },
                                { type: 'email', message: 'Email inválido' },
                            ]}
                        >
                            <Input prefix={<MailOutlined />} />
                        </Form.Item>
                        <Form.Item<ILoginForm>
                            name="password"
                            label="Senha"
                            rules={[{ required: true, message: 'Senha é obrigatória' }]}
                        >
                            <Input.Password prefix={<LockOutlined />} />
                        </Form.Item>
                        <Flex gap={10} justify="flex-end">
                            <Form.Item>
                                <Button onClick={() => navigate('/subscription')} htmlType="button">
                                    Cadastrar
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button loading={loading} type="primary" htmlType="submit">
                                    Logar
                                </Button>
                            </Form.Item>
                        </Flex>
                    </Form>
                </Card>
            </Flex>
        </Layout>
    )
}

export default Login
