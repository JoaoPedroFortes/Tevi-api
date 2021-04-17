import { loadFirebase } from '../../../lib/db.js'

async function dadosContato(req, res) {
    if (req.method === 'POST') {
        try {
            const body = req.body
            const contatos = {
                "userId": body.userId,
                "celular": body.celular,
                "userId": body.userId,
                "linkedin": body.linkedin,
                "facebook": body.facebook,
                "email": body.email,
                "site": body.site,
                "instagram": body.instagram,
                "twitter": body.twitter
            }


            const result = await setUserDadosContato(contatos);

            console.log("res: ", result)
            res.status(200).json(result);



        } catch (error) {
            console.log(error)

        }



    }

}


async function setUserDadosContato(contatos) {

    console.log(contatos)
    let userId = contatos.userId
    let dados = []

    let firebase = loadFirebase();

    let updates = {};
    updates = contatos;
    let id = '';

    const dadosContatoRef = firebase.firestore().collection('dadosContato');
    const query = await dadosContatoRef.where("userId", "==", userId).get();

    if (query.empty) {
        firebase.firestore().collection('dadosContato').add(updates);
        return 'adicionado'
    }
    else {
        query.forEach((doc) => {
            id = doc.id
        })
        let docRef = firebase.firestore().collection("dadosContato").doc(id);
        docRef.update(updates)
        return 'alterado'
    }

}
export default dadosContato;
