import { loadFirebase } from '../../../lib/db.js'



async function getUser(req, res) {
    try {
        if (req.method === 'POST') {
            const userId = req.body.userId;
    
            const result = await (getUserById(userId));
            console.log("res: ", await result)
            res.status(200).json(result);
        } else {
            res.status(500).json(new Date().getDate())
        }
    } catch (error) {
        console.log(error)
    }
}

const getUserById = async (userId) =>{

    const userRef = firebase.firestore().collection('users');
    const query = await userRef.doc(userId).get();

    if (query.empty) {
        console.log("nenhum encontrado");
        return [];
    }

    return query

}

export default getUser;