import { Tables } from './database.types'

export interface ILiveDayRow extends Tables<'lives'> {}

export interface ILiveDayInput extends Omit<ILiveDayRow, 'id' | 'created_at'> {}

export interface ILiveReportRow extends Omit<ILiveDayInput, 'date'> {
    displayName: string
    numberOfDays: number
}
