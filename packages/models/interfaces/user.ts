export interface IUserClaims {
    admin: boolean
    userConfirmed: boolean
}

export interface IUserInput {
    displayName: string
    disabled: boolean
    email: string
    username: string
    password: string
    photoURL?: string
    phoneNumber?: string
    claims: IUserClaims
}

export interface IUser extends Omit<IUserInput, 'password'> {
    id: string
}

export interface IAutheticationContext {
    user: IUser
    claims: IUserClaims
}
