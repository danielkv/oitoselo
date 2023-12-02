import { Pagination } from '@supabase/supabase-js'

export interface IPagination {
    page?: number
    pageSize?: number
}

export interface IPaginationResponse extends Pagination {}

export interface IPaginatedResponse<T> extends IPaginationResponse {
    items: T[]
}
