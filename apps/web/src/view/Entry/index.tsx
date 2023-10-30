import { router } from '../../router'
import { useConfig } from '@hooks/auth/useConfig'
import { ConfigProvider } from 'antd'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import duration from 'dayjs/plugin/duration'
import { RouterProvider } from 'react-router-dom'

dayjs.locale(ptBR)
dayjs.extend(duration)

const Entry: React.FC = () => {
    useConfig()

    return (
        <ConfigProvider>
            <RouterProvider router={router} />
        </ConfigProvider>
    )
}

export default Entry
