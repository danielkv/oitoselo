export interface ILiveDayInput {
    uid: string
    date: string
    username: string
    displayName: string
    diamonds: number
    duration: number
}

export interface ILiveDayRow extends ILiveDayInput {
    id: string
}

export interface ILiveReportRow extends Omit<ILiveDayInput, 'date'> {}
