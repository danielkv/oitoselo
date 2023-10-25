export interface IUserInput {
    displayName: string
    email: string
    username: string
    password: string
    photoURL?: string
    phoneNumber?: string
}

export interface IUser extends Omit<IUserInput, 'password'> {
    id: string
    photoURL?: string
    phoneNumber?: string
}
