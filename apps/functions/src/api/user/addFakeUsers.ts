import { init } from '../../helpers/init'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import * as functions from 'firebase-functions'
import { map } from 'radash'

init()

const fakeUsers = [
    {
        displayName: 'Adrielly Letícia Silva Oliveira',
        username: 'rubrum.conjure',
        email: 'danielkv@gmail.com',
        password: '123456',
        claims: { admin: true },
    },
    {
        displayName: 'Adriene Lindaura Rodrigues Araújo',
        username: 'adriene.araujo',
        claims: { userConfirmed: true },
    },
    {
        displayName: 'Alexandre Vitor Silva Requeira Costa',
        username: 'vitorhachi',
    },
    {
        displayName: 'Alijhenys de Melo Avelar',
        username: 'aliihmelo',
    },
    {
        displayName: 'Alisson Ricardo Francisco',
        username: 'alissonrftv',
    },
    {
        displayName: 'Ana Clara Barcelos Braga Pereira',
        username: '.bemclara',
    },
    {
        displayName: 'Ana Clara Da Costa Caetano',
        username: 'caeqs',
    },
    {
        displayName: 'Ana Luíza Andrade',
        username: 'analuizandrades',
    },
    {
        displayName: 'Andressa Macedo Silva de Souza',
        username: 'aamacedo',
    },
    {
        displayName: 'Anne Karyn de Azevedo Machado',
        username: 'annemachado_nails',
    },
    {
        displayName: 'Anne Kelly Gomes da silva',
        username: 'anne_kelly5',
    },
    {
        displayName: 'Bárbara de Lima Novaes',
        username: 'barbaranovaes2002',
    },
    {
        displayName: 'Beatriz Forster de Araújo',
        username: 'biaforsterr',
    },
    {
        displayName: 'Berenice Candido Lopes',
        username: 'bereclopes',
    },
    {
        displayName: 'Brenda Bovo',
        username: 'is.bovo',
    },
    {
        displayName: 'Bruna Destro',
        username: 'brunadestro',
    },
    {
        displayName: 'Bruna Kathleen Boeff',
        username: 'brunaboeffofc',
    },
    {
        displayName: 'Bruno Fagundes',
        username: 'byebrunofagundes',
    },
    {
        displayName: 'Caiane Arjona',
        username: 'ccnarj',
    },
    {
        displayName: 'Carlos Eduardo Gonçalves',
        username: 'fala.carlos',
    },
]

export const addFakeUsers = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send('Método não permitido')
        return
    }

    const db = getFirestore()
    const auth = getAuth()

    const batch = db.batch()

    await map(fakeUsers, async (user) => {
        const newAuthUser = await auth.createUser({
            displayName: user.displayName,
            email: user.email,
            password: user.password,
        })
        await auth.setCustomUserClaims(newAuthUser.uid, {
            admin: !!user.claims?.admin,
            userConfirmed: !!user.claims?.userConfirmed,
        })

        const newDoc = db.collection('users').doc(newAuthUser.uid)
        batch.create(newDoc, {
            ...user,
            disabled: false,
            claims: { admin: !!user.claims?.admin, userConfirmed: !!user.claims?.userConfirmed },
        })
    })

    await batch.commit()

    res.send('added')
})
