import { IUser } from 'oitoselo-models'

export async function updateUserUseCase(uid: string, data: Partial<IUser>): Promise<void> {
    throw new Error('Não é possível alterar um usuário no momento')
}
