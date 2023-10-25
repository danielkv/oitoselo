import { init } from '../../helpers/init'
import * as dayjs from 'dayjs'
import * as duration from 'dayjs/plugin/duration'
import { getFirestore } from 'firebase-admin/firestore'
import * as functions from 'firebase-functions'
import { IncomingForm } from 'formidable-serverless'
import { cluster, map, objectify } from 'radash'
import * as readXlsxFile from 'read-excel-file/node'

init()

dayjs.extend(duration)

export const spreadsheetUpload = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send('Método não permitido')
        return
    }

    const form = new IncomingForm()

    //@ts-expect-error
    form.parse(req, async (err, _, files) => {
        if (err) return res.status(500).send('Erro ao mover arquivo para o armazenamento: ' + err.message)

        const file = files.file

        //@ts-expect-error
        const fileContent = (await readXlsxFile(file.path)) as []
        fileContent.splice(0, 1) // ignore first row

        if (fileContent.some((row) => row[3] > 1)) throw new Error('A planilha deve ser apenas de 1 dia')

        const table = fileContent.map(parseRow)

        const usernameMap = await findUserFromTable(table)

        const db = getFirestore()
        const batch = db.batch()
        const liveCollection = db.collection('lives')

        table.forEach((row) => {
            if (!row.username) return

            const uid = usernameMap[row.username] || 'unknown'

            const live = {
                ...row,
                uid,
            }

            const newDoc = liveCollection.doc()
            batch.create(newDoc, live)
        }, [])

        await batch.commit()

        res.send('lives added')
    })
})

async function findUserFromTable(table: Omit<Record<string, any>, 'uid'>[]) {
    const usernamesCluster = cluster(
        table.map((row) => row.username),
        30
    )

    const db = getFirestore()
    const userCollection = db.collection('users')

    const usersSnapshot = await map(usernamesCluster, (usernames) =>
        userCollection.where('username', 'in', usernames).get()
    )

    const users: Record<string, string>[] = usersSnapshot
        .map((snap) => snap.docs)
        .flat()
        .map((user) => ({ id: user.id, ...user.data() }))

    const usersMap = objectify(
        users,
        (f) => f.username,
        (f) => f.id
    )

    return usersMap
}

function parseRow(data: any[]): Omit<Record<string, any>, 'uid'> {
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
