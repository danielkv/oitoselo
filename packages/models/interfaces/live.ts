export interface ILiveTableRowInput {
    uid: string
    username: string
    displayName: string
    diamonds: number
    duration: number
    days: number
}

export interface ILiveTableRow extends ILiveTableRowInput {
    id: string
}
