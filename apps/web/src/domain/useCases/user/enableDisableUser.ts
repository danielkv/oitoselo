type TAction = 'enable' | 'disable'

//@ts-expect-error
export async function enableDisableUserUseCase(uid: string, action: TAction) {
    throw new Error('Não é possível habilitar ou desabilitar um usuário no momento')
}
