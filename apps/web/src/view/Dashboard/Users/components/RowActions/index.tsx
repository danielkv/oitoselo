import {
    CheckCircleOutlined,
    DeleteOutlined,
    LockOutlined,
    SafetyCertificateFilled,
    SafetyCertificateOutlined,
    UnlockFilled,
} from '@ant-design/icons'
import { getErrorMessage } from '@common/helpers/getErrorMessage'
import { useAuthenticationContext } from '@contexts/auth/useAuthenticationContext'
import { demoteAdminUserUseCase } from '@useCases/auth/demoteUserToAdmin'
import { promoteUserToAdminUseCase } from '@useCases/auth/promoteUserToAdmin'
import { confirmUserUseCase } from '@useCases/user/confirmUser'
import { deleteUserUseCase } from '@useCases/user/deleteUser'
import { enableDisableUserUseCase } from '@useCases/user/enableDisableUser'
import { Button, Flex, Modal, message } from 'antd'
import { IUser } from 'oitoselo-models'
import { ReactNode, useCallback, useState } from 'react'

type TAction = 'confirm' | 'promote' | 'demote' | 'delete' | 'disable' | 'enable'

interface RowActionsProps {
    user: IUser
    hideButtons?: TAction[]
    onSuccess?: (user: IUser) => void | Promise<void>
}

interface IButton {
    title: string
    icon: ReactNode
    confirmationMessage: string
    successMessage: string
    disabled?: (user: IUser) => boolean
    onClick: (uid: string) => Promise<void>
}

const BUTTONS: Record<TAction, IButton> = {
    confirm: {
        title: 'Confirmar',
        icon: <CheckCircleOutlined />,
        confirmationMessage: 'Tem certeza que deseja confirmar esse usuário',
        successMessage: 'Usuário confirmado!',
        onClick: confirmUserUseCase,
    },
    disable: {
        title: 'Bloquear',
        icon: <LockOutlined />,
        confirmationMessage: 'Tem certeza que deseja bloqueado esse usuário',
        successMessage: 'Usuário desabilitado!',
        onClick: (uid: string) => enableDisableUserUseCase(uid, 'disable'),
    },
    enable: {
        title: 'Desbloquear',
        icon: <UnlockFilled />,
        confirmationMessage: 'Tem certeza que deseja desbloqueado esse usuário',
        successMessage: 'Usuário habilitado!',
        onClick: (uid: string) => enableDisableUserUseCase(uid, 'enable'),
    },
    promote: {
        title: 'Promover a administrador',
        icon: <SafetyCertificateOutlined />,
        confirmationMessage: 'Tem certeza que deseja promover esse usuário',
        successMessage: 'Usuário promovido!',
        onClick: promoteUserToAdminUseCase,
    },
    demote: {
        title: 'Rebaixar administrador',
        icon: <SafetyCertificateFilled />,
        confirmationMessage: 'Tem certeza que deseja rebaixar esse usuário',
        successMessage: 'Usuário rebaixado!',
        onClick: demoteAdminUserUseCase,
    },
    delete: {
        title: 'Excluir',
        icon: <DeleteOutlined />,
        confirmationMessage: 'Tem certeza que deseja excluir esse usuário',
        successMessage: 'Usuário excluido!',
        onClick: deleteUserUseCase,
    },
}

const RowActions: React.FC<RowActionsProps> = ({ user, hideButtons, onSuccess }) => {
    const [loading, setLoading] = useState<TAction | null>(null)
    const loggedUser = useAuthenticationContext((context) => context.authetication?.user)

    const handleSubmitButton = useCallback(
        async (actionKey: TAction) => {
            try {
                setLoading(actionKey)
                const action = BUTTONS[actionKey]

                await action.onClick(user.id)
                await Promise.resolve(onSuccess?.(user))

                message.success(action.successMessage)
            } catch (err) {
                Modal.error({ title: 'Ocorreu um erro', content: getErrorMessage(err) })
            } finally {
                setLoading(null)
            }
        },
        [user.id]
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
        [user.id]
    )

    return (
        <Flex gap={4}>
            {Object.entries(BUTTONS).map(([key, button]) => {
                if (hideButtons?.includes(key as TAction)) return
                if (key === 'enable' && !user.disabled) return
                if (key === 'disable' && user.disabled) return
                if (key === 'promote' && user.claims.admin) return
                if (key === 'demote' && !user.claims.admin) return

                return (
                    <Button
                        disabled={user.id === loggedUser?.id}
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
