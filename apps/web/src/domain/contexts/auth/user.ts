import { IAutheticationContext } from 'oitoselo-models'
import { create } from 'zustand'

interface IAppAuthContext {
    authetication: IAutheticationContext | null
    setAuthetication(user: IAutheticationContext | null): void
}

export const useAthenticationContext = create<IAppAuthContext>((set) => ({
    authetication: null,
    setAuthetication(authetication) {
        set({ authetication })
    },
}))
