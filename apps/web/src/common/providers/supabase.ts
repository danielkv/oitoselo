import { FunctionInvokeOptions } from '@supabase/functions-js'
import { createClient } from '@supabase/supabase-js'
import { Database } from 'oitoselo-models'

const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL
const publicToken = import.meta.env.VITE_APP_SUPABASE_APPKEY

export const supabase = createClient<Database>(supabaseUrl, publicToken)

export function createFunction<Body extends object = any, Response = void>(
    name: string,
    defaultOptions?: Omit<FunctionInvokeOptions, 'body'>
): (params?: Body, headers?: FunctionInvokeOptions) => Promise<Response> {
    return async (params?: Body, options = defaultOptions) => {
        const _options: FunctionInvokeOptions = {
            body: params,
            ...options,
        }

        const { data, error } = await supabase.functions.invoke<Response>(name, _options)

        if (error) throw error

        return data as Response
    }
}
