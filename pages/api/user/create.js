import { loadFirebase } from '../../../lib/db.js'
import getRawBody from 'raw-body'

//let firebase = await loadFirebase();
//let db = firebase.firestore().collection('users')

async function create(req, res) {
    let firebase = await loadFirebase();
    if (req.method === 'POST') {
        try {
            
          
            const body = req.body
            const user = {
                name: body.name,
                password: body.password,
                login: body.login,
                birthdate: body.birthdate
            }


            let updates = {};
            updates = user;
            res.setHeader('Content-Type', 'Application/Json');
            res.status(200).json(body)
            return  firebase.firestore().collection('users').add(updates);


        } catch (error) {
            console.log(error)
        }



    }

}
export default create;

