export interface IUserInput {
    displayName: string
    email: string
    username: string
    password: string
}

export interface IUser extends Omit<IUserInput, 'password'> {
    uid: string
    photoURL: string
    phoneNumber: string
}
