import { ISubscriptionForm } from '../../types'
import { MailOutlined, PhoneOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons'
import { Form, Input } from 'antd'

const UserMainFormFields: React.FC = () => {
    return (
        <>
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
                name="phone"
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
        </>
    )
}

export default UserMainFormFields
