import { router } from '../../router'
import { ConfigProvider } from 'antd'
import { RouterProvider } from 'react-router-dom'
import { useConfig } from 'src/domain/hooks/app/useConfig'

const Entry: React.FC = () => {
    useConfig()

    return (
        <ConfigProvider>
            <RouterProvider router={router} />
        </ConfigProvider>
    )
}

export default Entry
