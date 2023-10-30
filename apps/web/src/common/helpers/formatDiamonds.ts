const formatter = new Intl.NumberFormat('pt-BR', {})

export function formatDiamonds(diamonds: number): string {
    if (!diamonds) return '-'

    return formatter.format(diamonds)
}
