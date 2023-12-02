import { supabase } from '@common/providers/supabase'
import { UploadFile } from 'antd'
import { RcFile } from 'antd/lib/upload'
import dayjs from 'dayjs'
import { ILiveDayInput } from 'oitoselo-models'
import { objectify } from 'radash'
import readXlsxFile from 'read-excel-file'

interface ISendReportUseCase {
    date: string
    file: UploadFile
}

export async function sendReportUseCase({ file, date }: ISendReportUseCase) {
    if (!date || !dayjs(date).isValid()) throw new Error('Envie uma data válida')

    const fileContent = await readXlsxFile(file as RcFile)
    //fileContent.splice(0, 1) // ignore first row

    if (fileContent.some((row) => (row[2] as number) > 1)) throw new Error('A planilha deve ser apenas de 1 dia')

    const table = fileContent.map(_parseRow)

    const usernameMap = await _findUserFromTable(table)

    const mappedTable = table.map<ILiveDayInput>((row) => ({
        ...row,
        date: dayjs(date).format('YYYY-MM-DD'),
        userId: row.username ? usernameMap[row.username] : null,
    }))

    await supabase.from('lives').insert(mappedTable)
}

async function _findUserFromTable(table: Omit<Record<string, any>, 'uid'>[]) {
    const usernames = table.map((row) => row.username)

    const { error, data: users } = await supabase.from('profiles').select('id, username').in('username', usernames)

    if (error) throw error
    if (!users) throw new Error('Nenhum usuário encontrado')

    const usersMap = objectify(
        users as { id: string; username: string }[],
        (f) => f.username,
        (f) => f.id
    )

    return usersMap
}

function _parseRow(data: any[]): Omit<ILiveDayInput, 'date'> {
    const [username] = data[0]?.split('\n\n') || ['noname', 'noname']
    const diamonds = Number(data[3].toString().replace('.', ''))
    const duration = _parseDuration(data[1])

    return {
        username,
        diamonds,
        duration,
        userId: null,
    }
}

function _parseDuration(durationRaw: string): number {
    const pattern = /^(?:(?<hours>\d+)h)?(?:(?<minutes>\d+)min)?(?<seconds>\d+)s$/
    const match = durationRaw.match(pattern)

    if (!match?.groups) throw new Error('No duration found')

    const { hours, minutes, seconds } = match.groups

    const duration = dayjs.duration({ hours: Number(hours), minutes: Number(minutes), seconds: Number(seconds) })

    return duration.asSeconds()
}
