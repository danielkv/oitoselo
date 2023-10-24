import { init } from '../helpers/init'
import { getFirestore } from 'firebase-admin/firestore'
import * as functions from 'firebase-functions'

init()

const fakeUsers = [
    {
        name: 'Adrielly Letícia Silva Oliveira',
        username: 'rubrum.conjure',
    },
    {
        name: 'Adriene Lindaura Rodrigues Araújo',
        username: 'adriene.araujo',
    },
    {
        name: 'Alexandre Vitor Silva Requeira Costa',
        username: 'vitorhachi',
    },
    {
        name: 'Alijhenys de Melo Avelar',
        username: 'aliihmelo',
    },
    {
        name: 'Alisson Ricardo Francisco',
        username: 'alissonrftv',
    },
    {
        name: 'Ana Clara Barcelos Braga Pereira',
        username: '.bemclara',
    },
    {
        name: 'Ana Clara Da Costa Caetano',
        username: 'caeqs',
    },
    {
        name: 'Ana Luíza Andrade',
        username: 'analuizandrades',
    },
    {
        name: 'Andressa Macedo Silva de Souza',
        username: 'aamacedo',
    },
    {
        name: 'Anne Karyn de Azevedo Machado',
        username: 'annemachado_nails',
    },
    {
        name: 'Anne Kelly Gomes da silva',
        username: 'anne_kelly5',
    },
    {
        name: 'Bárbara de Lima Novaes',
        username: 'barbaranovaes2002',
    },
    {
        name: 'Beatriz Forster de Araújo',
        username: 'biaforsterr',
    },
    {
        name: 'Berenice Candido Lopes',
        username: 'bereclopes',
    },
    {
        name: 'Brenda Bovo',
        username: 'is.bovo',
    },
    {
        name: 'Bruna Destro',
        username: 'brunadestro',
    },
    {
        name: 'Bruna Kathleen Boeff',
        username: 'brunaboeffofc',
    },
    {
        name: 'Bruno Fagundes',
        username: 'byebrunofagundes',
    },
    {
        name: 'Caiane Arjona',
        username: 'ccnarj',
    },
    {
        name: 'Carlos Eduardo Gonçalves',
        username: 'fala.carlos',
    },
    {
        name: 'Cláudia Silva',
        username: 'cla_udinha299',
    },
    {
        name: 'Claudineia de Souza Gomes',
        username: 'neyasouzag',
    },
    {
        name: 'Daiany de medeiros silva',
        username: 'daiany_medeiros',
    },
    {
        name: 'Daniela Damaceno Ferreira',
        username: 'dadamaceno_',
    },
    {
        name: 'Diana Futra',
        username: 'dii_futra',
    },
    {
        name: 'Dlânia Dourado',
        username: 'dlania',
    },
    {
        name: 'Drielly',
        username: 'dricafoxy',
    },
    {
        name: 'Emely Mel',
        username: 'emelymel2',
    },
    {
        name: 'Erica Bianca',
        username: 'borbolettaofc',
    },
    {
        name: 'Estefane Silva Barbosa Dantas',
        username: 'esteefane.silva',
    },
    {
        name: 'Evelyn Maria Silva Dos Santos',
        username: 'evelynmaquiadora_',
    },
    {
        name: 'Evelyn Maysa',
        username: 'evmaysa',
    },
    {
        name: 'Fernanda Maria do Carmo Barros',
        username: 'fernanda_carmoo',
    },
    {
        name: 'Flávia Kelly Silva de Freitas',
        username: 'flakellyy',
    },
    {
        name: 'Gabriela Santos Rocha',
        username: 'muagabrielarocha',
    },
    {
        name: 'Gabriella Gomides Martins',
        username: 'gabriella_gomides',
    },
    {
        name: 'Gabrielly Velasco',
        username: 'gaabbvlsco',
    },
    {
        name: 'Georgia Thaisa Torres de Andrade',
        username: 'gigigonx',
    },
    {
        name: 'Giane Ferreira caldeira',
        username: 'giifeerreira',
    },
    {
        name: 'Ingrid de Souza lima',
        username: 'iindyliima',
    },
    {
        name: 'Isabella Helena Gomes Rodrigues',
        username: 'zzabella._',
    },
    {
        name: 'Isabella Oliveira',
        username: 'belladeoli',
    },
    {
        name: 'Isabelle Ayumi Nagai Costa',
        username: 'isa_ayumi21',
    },
    {
        name: 'Isabelle Broering Vieira',
        username: 'isabroeringg',
    },
    {
        name: 'Izamara Paulino',
        username: 'isaedrielle',
    },
    {
        name: 'Jaqueline Pinheiro da Silva',
        username: 'jaaypi_',
    },
    {
        name: 'João Vitor Da Rocha Dias',
        username: 'frajoao_',
    },
    {
        name: 'Jordana Duarte',
        username: 'dutedana',
    },
    {
        name: 'Julya Costa Borges',
        username: 'julya_cb',
    },
    {
        name: 'Laisa Mayer',
        username: 'laisamayer',
    },
    {
        name: 'Larissa de Souza Macedo',
        username: 'bellafg__',
    },
    {
        name: 'Lorena Pinho',
        username: 'lorena.pinho',
    },
    {
        name: 'Luana de Oliveira Rodrigues de Moraes',
        username: 'luanarodriguesbrr',
    },
    {
        name: 'Lucas Da Silvia Monteiro',
        username: 'luke_monteiro0',
    },
    {
        name: 'Luciana Gualberto',
        username: 'lugualberto__',
    },
    {
        name: 'Marcus Vinícius Melo Machado',
        username: 'marcuschado',
    },
    {
        name: 'Mari Rondon',
        username: 'marii.cr',
    },
    {
        name: 'Maria Alice Callejon',
        username: 'mariaalicecallejonz',
    },
    {
        name: 'Maria Inês Santos',
        username: 'umagroomer',
    },
    {
        name: 'Matheus Ferreira Silva Gandra',
        username: 'matheusgandra._',
    },
    {
        name: 'Mizya Jahrede Manary Ferreira Pereira Mendes',
        username: 'mizyajahrede',
    },
    {
        name: 'Monica suely de lima',
        username: 'monica.blessed',
    },
    {
        name: 'Myrella de Souza Silva',
        username: '_silvaamyrella',
    },
    {
        name: 'Nadia Ribeiro de Oliveira',
        username: 'nadiaribelo63',
    },
    {
        name: 'Olívia  de Almeida Neves',
        username: 'aolivianeves',
    },
    {
        name: 'Quetsia Marques Rangel',
        username: 'quetsiamarques',
    },
    {
        name: 'Raquel Silva de Jesus',
        username: 'bali.star',
    },
    {
        name: 'Sabrina Diogo Silva Barbosa',
        username: 'sabrinaabarbosaa',
    },
    {
        name: 'Sarah Pessanha Barbosa',
        username: 'sarahpesperr',
    },
    {
        name: 'Shayane da Silva Santos',
        username: 'ssp1nk',
    },
    {
        name: 'Stephanie Caroline dos Santos',
        username: 'stelola_',
    },
    {
        name: 'Sthefany Borges Passos',
        username: 'passosdasthefany',
    },
    {
        name: 'Tainá Rodrigues de Abreu',
        username: 'tainarodriiguess',
    },
    {
        name: 'Tereza Francisca Corrêa E Silva',
        username: 'itsterezacorrea',
    },
    {
        name: 'Thaís Mota Menezes Cherem',
        username: 't_mmc',
    },
    {
        name: 'Thalita Gomes de Oliveira',
        username: 'thalitahope',
    },
    {
        name: 'Valkíria Leles',
        username: 'valkirialeles',
    },
    {
        name: 'Victoria Candida Da Silva Magalhães',
        username: 'vickcandoficial',
    },
    {
        name: 'Victoria Granden Vargas da Silva',
        username: 'victoriagvargas_',
    },
    {
        name: 'Amanda Vitoria Xavier Da Silva',
        username: 'mandyniv',
    },
    {
        name: 'Fernanda Santos - RETORNO',
        username: 'feernandas',
    },
    {
        name: 'Beatriz Kamilly',
        username: 'b.e.e.a.kvc',
    },
    {
        name: 'Beatriz Bressan',
        username: 'tiz.bressan',
    },
    {
        name: 'Ozana Isabella Correia de Alcântara',
        username: 'izzebee.z',
    },
    {
        name: 'Jessika Fernandes',
        username: 'jessikafernandes27',
    },
    {
        name: 'Ana Beatriz Rodrigues',
        username: '.andryezs',
    },
    {
        name: 'DarleneOliveira',
        username: 'darlenreal',
    },
]

export const addFakeUsers = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send('Método não permitido')
        return
    }

    const db = getFirestore()

    const batch = db.batch()

    fakeUsers.forEach((user) => {
        const newDoc = db.collection('users').doc()

        batch.create(newDoc, user)
    })

    await batch.commit()

    res.send('added')
})
