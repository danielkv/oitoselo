import { IPaginatedResponse, IPagination, IPaginationResponse } from '@interfaces/pagination'

export function getPagination({ page = 0, pageSize = 20 }: IPagination) {
    const from = page * pageSize
    const to = from + pageSize

    return { from, to }
}

export function buildPaginatedResponse<T>(
    items: T[],
    totalCount: number,
    pagination: IPagination
): IPaginatedResponse<T> {
    return { items, ...getPaginationResult(totalCount, pagination) }
}

export function getPaginationResult(totalCount: number, { page = 0, pageSize = 20 }: IPagination): IPaginationResponse {
    const lastPage = Math.ceil(totalCount / pageSize)
    const nextPage = page + 1 < lastPage ? page + 1 : null

    return {
        lastPage,
        nextPage,
        total: totalCount,
    }
}
