import { ISorting } from '@interfaces/sorting'

export function getSorting<T extends object>({ sortBy, order }: ISorting<T>, defaultsSortBy?: keyof T) {
    return { sortBy: sortBy || defaultsSortBy || 'id', order: order || 'asc' }
}
