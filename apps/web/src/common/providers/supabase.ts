import { createClient } from '@supabase/supabase-js'
import { Database } from 'oitoselo-models'

const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL
const publicToken = import.meta.env.VITE_APP_SUPABASE_APPKEY

export const supabase = createClient<Database>(supabaseUrl, publicToken)

export function createFunction<Body extends object = any, Response = any>(
    name: string
): (params?: Body, headers?: Record<string, any>) => Promise<Response | null> {
    return async (params?: Body, headers?: Record<string, any>) => {
        const { data, error } = await supabase.functions.invoke<Response>(name, {
            headers,
            body: params,
        })
        if (error) throw error

        return data
    }
}
