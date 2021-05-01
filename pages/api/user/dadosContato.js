import { loadFirebase } from '../../../lib/db.js'

async function dadosContato(req, res) {
    if (req.method === 'POST') {
        try {
            const userId = req.body.userId;
            console.log(userId)
            const result = await getUserDadosContato(userId);



            console.log("res: ", result)
            res.status(200).json(result);



        } catch (error) {
            console.log(error)
            res.status(500).message("erro")
        }



    }

}


async function getUserDadosContato(userId) {
    let dados = []
    let firebase = loadFirebase();
    console.log('user: ' + userId)
    const dadosContatoRef = firebase.firestore().collection('dadosContato');
    const query = await dadosContatoRef.where("userId", "==", userId).get();

    if (query.empty) {
        console.log("nenhum encontrado");
        return;
    }

    query.forEach((doc) => {
        dados.push(doc.data())
    })

    console.log('dados:' + dados)
    return dados
}
export default dadosContato;
