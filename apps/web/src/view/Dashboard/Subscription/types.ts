import { IUserInput } from "oitoselo-models";

export interface ISubscriptionForm extends IUserInput {
    repeatPassword: string
}