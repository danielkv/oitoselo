export interface IUserClaims {
    userrole?: 'default' | 'none'
    claims_admin?: boolean
}

export interface IUserMetadata {
    displayName: string
    disabled: boolean
    username: string | null
    photoURL?: string
}

export interface IUserInput extends Omit<IUserMetadata, 'disabled'> {
    email: string
    password: string
    phone?: string | null
}

export interface IUser extends IUserMetadata {
    id: string
    email: string
    phone?: string | null
}

export interface IUserContext extends IUser {
    claims: IUserClaims
}

export interface IAutheticationContext {
    user: IUserContext
    //claims: IUserClaims
}
