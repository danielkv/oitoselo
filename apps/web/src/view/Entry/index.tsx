import { router } from '../../router'
import { useConfig } from '@hooks/auth/useConfig'
import { ConfigProvider } from 'antd'
import locale from 'antd/locale/pt_BR'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import 'dayjs/locale/pt-br'
import duration from 'dayjs/plugin/duration'
import { RouterProvider } from 'react-router-dom'

dayjs.locale(ptBR)
dayjs.extend(duration)

const Entry: React.FC = () => {
    useConfig()

    return (
        <ConfigProvider locale={locale}>
            <RouterProvider router={router} />
        </ConfigProvider>
    )
}

export default Entry
