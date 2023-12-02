import { DeleteOutlined } from '@ant-design/icons'
import { getErrorMessage } from '@common/helpers/getErrorMessage'
import { deleteLiveDaysUseCase } from '@useCases/reports/deleteLiveDays'
import { Button, Flex, Modal, message } from 'antd'
import { ILiveDayRow } from 'oitoselo-models'
import { ReactNode, useCallback, useState } from 'react'

type TAction = 'delete'

interface RowActionsProps {
    record: ILiveDayRow
    hideButtons?: TAction[]
    onSuccess?: (record: ILiveDayRow) => void | Promise<void>
}

interface IButton {
    title: string
    icon: ReactNode
    confirmationMessage: string
    successMessage: string
    disabled?: (record: ILiveDayRow) => boolean
    onClick: (id: number) => Promise<void>
}

const BUTTONS: Record<TAction, IButton> = {
    delete: {
        title: 'Excluir',
        icon: <DeleteOutlined />,
        confirmationMessage: 'Tem certeza que deseja excluir esse dia',
        successMessage: 'Dia excluido!',
        onClick: (id: number) => deleteLiveDaysUseCase([id]),
    },
}

const RowActions: React.FC<RowActionsProps> = ({ record, hideButtons, onSuccess }) => {
    const [loading, setLoading] = useState<TAction | null>(null)

    const handleSubmitButton = useCallback(
        async (actionKey: TAction) => {
            try {
                setLoading(actionKey)
                const action = BUTTONS[actionKey]

                await action.onClick(record.id)
                await Promise.resolve(onSuccess?.(record))

                message.success(action.successMessage)
            } catch (err) {
                Modal.error({ title: 'Ocorreu um erro', content: getErrorMessage(err) })
            } finally {
                setLoading(null)
            }
        },
        [record.id]
    )

    const handleClickButton = useCallback(
        async (actionKey: TAction) => {
            const action = BUTTONS[actionKey]

            Modal.confirm({
                title: 'Confirmação',
                content: action.confirmationMessage,
                onOk: () => handleSubmitButton(actionKey),
                okText: 'Sim',
                cancelText: 'Cancelar',
                centered: true,
            })
        },
        [record.id]
    )

    return (
        <Flex gap={4}>
            {Object.entries(BUTTONS).map(([key, button]) => {
                if (hideButtons?.includes(key as TAction)) return

                return (
                    <Button
                        onClick={() => handleClickButton(key as TAction)}
                        loading={loading === key}
                        key={key}
                        shape="circle"
                        title={button.title}
                        icon={button.icon}
                    />
                )
            })}
        </Flex>
    )
}

export default RowActions
