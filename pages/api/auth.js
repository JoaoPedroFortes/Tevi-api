import { loadFirebase } from '../../lib/db.js'




async function location(req, res) {
    try {
        if (req.method === 'POST') {
            const login = req.body.login;
            const password = req.body.password;
            const result = await existe(login, password);
            console.log("res: ", await result)
            res.status(200).json(result);
        } else {
            res.status(500).json({"date": new Date(),'message': 'metodo não aceito'})
        }
    } catch (error) {
        console.log(error)
    }
}


async function existe(login,password){
    let firebase = loadFirebase();

    let id = '';
    const locationRef = firebase.firestore().collection('users');

    const query = await locationRef.where("login", "==", login).where("password", "==", password).get();

    query.forEach((doc) => {
       id = doc.id
    })


    if (query.empty) {
        console.log("nenhum encontrado");
        return false;
    }

    
    return id

}

export default location;