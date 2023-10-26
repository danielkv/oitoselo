import { router } from '../../router'
import { useConfig } from '@hooks/auth/useConfig'
import { ConfigProvider } from 'antd'
import { RouterProvider } from 'react-router-dom'

const Entry: React.FC = () => {
    useConfig()

    return (
        <ConfigProvider>
            <RouterProvider router={router} />
        </ConfigProvider>
    )
}

export default Entry
