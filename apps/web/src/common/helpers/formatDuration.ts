import dayjs from 'dayjs'

export function formatDuration(sec: number): string {
    if (!sec) return '-'

    const duration = dayjs.duration({ seconds: sec })

    const days = Math.floor(duration.asDays())
    const hours = Math.floor(duration.subtract(days, 'days').asHours())
    const minutes = Math.floor(duration.subtract(days, 'days').subtract(hours, 'h').asMinutes())
    const seconds = Math.floor(duration.subtract(days, 'days').subtract(hours, 'h').subtract(minutes, 'm').asSeconds())

    if (days > 0) return `${days}d${hours}h${minutes}m${seconds}s`

    if (hours > 0) return `${hours}h${minutes}m${seconds}s`

    if (minutes > 0) return `${minutes}m${seconds}s`

    return `${seconds}s`
}
