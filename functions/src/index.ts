import { IDiamondRow } from './interfaces/diamonds'
import { TDiamondContentTableRaw } from './interfaces/xlsFile'
import * as dayjs from 'dayjs'
import * as duration from 'dayjs/plugin/duration'
import * as functions from 'firebase-functions'
import { IncomingForm } from 'formidable-serverless'
import readXlsxFile from 'read-excel-file/node'

dayjs.extend(duration)

export const spreadsheetUpload = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send('Método não permitido')
        return
    }

    const form = new IncomingForm()

    //@ts-expect-error
    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).send('Erro ao mover arquivo para o armazenamento: ' + err.message)

        const file = files.file

        const fileContent = await readXlsxFile(file.path)
        fileContent.splice(0, 1) // ignore first row

        return res.json(parseContent(fileContent as TDiamondContentTableRaw[]))
    })
})

function parseContent(content: TDiamondContentTableRaw[]): IDiamondRow[] {
    return content.map(parseRow)
}

function parseRow(data: TDiamondContentTableRaw): IDiamondRow {
    const [username, displayName] = data[0].split('\n\n')
    const diamonds = Number(data[1].toString().replace('.', ''))
    const duration = parseDuration(data[2])
    const days = data[3]

    return {
        username,
        displayName,
        diamonds,
        duration,
        days,
    }
}

function parseDuration(durationRaw: string): number {
    const pattern = /^(?:(?<hours>\d+)h)?(?:(?<minutes>\d+)min)?(?<seconds>\d+)s$/
    const match = durationRaw.match(pattern)

    if (!match?.groups) throw new Error('No duration found')

    const { hours, minutes, seconds } = match.groups

    const duration = dayjs.duration({ hours: Number(hours), minutes: Number(minutes), seconds: Number(seconds) })

    return duration.asSeconds()
}
