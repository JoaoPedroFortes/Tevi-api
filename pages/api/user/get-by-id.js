import { loadFirebase } from '../../../lib/db.js'



async function getUser(req, res) {
    try {
        console.log("oii")
        if (req.method === 'POST') {
            const userId = req.body.userId;
            const result = await (getUserById(userId));


            res.status(200).json({ name: result.name });



        } else if (req.method === 'GET') {
            const obj = { msg: 'oieee' }
            res.status(200).json(obj)
        } else {
            res.status(500).json({ data: new Date().getDate(), msg: "ops" })
        }
    } catch (error) {
        console.log(error)
    }
}

const getUserById = async (userId) => {


    let firebase = loadFirebase();

    const userRef = firebase.firestore().collection('users');
    const query = await userRef.doc(userId).get();

    if (query.empty) {
        console.log("nenhum encontrado");
        return [];
    }

    return query.data()

}

export default getUser;