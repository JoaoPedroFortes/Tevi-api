import { loadFirebase } from '../../lib/db.js'


let firebase = await loadFirebase();
let db = firebase.firestore().collection('users')

async function create(req, res) {
    if (req.method === 'POST') {
        let user = {
            name:req.body
        }
        let newUserKey = db.ref().child('users').push().key;
        let updates = {};
        updates['/users'/+newUserKey]= user;
        return db.ref().update(updates);
       
    }

    res.status(200).json({ name: 'Testecreate' })
}
export default create;

