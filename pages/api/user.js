import { loadFirebase } from '../../lib/db.js'




async function getInitialProps() {
    let firebase = await loadFirebase();
    let data = []
    let result = await new Promise((resolve, reject) => {
        firebase.firestore().collection('users')
            .limit(10)
            .get()
            .then(snapshot => {
                //console.log(snapshot)

                snapshot.forEach(doc => {
                    data.push(Object.assign({
                        id: doc.id
                    }, doc.data()))
                })
                // console.log('entrei aqui')
                //  console.log(data)
                resolve(data)
               

            }).catch(error => {
                reject([])
            })
    }).catch(error => {
        throw new Error(error);
    })
 
    return data

}

async function user(req, res) {
    if(req.method!='GET'){
        res.status(500).json({message: "Ei, somente GET aqui! "})
    }
    const usersOnDb=[]
    const usuarios = getInitialProps();
    usuarios.then(function (result) {
        console.log('res:', result)
        for (let i = 0; i < result.length; i++) {
            let user = result[i];
            const login = user.login;
            const name = user.name;
            const birthdate = new Date(user.birthdate.seconds *1000 )

            const userData = {
                login, password, name, birthdate
            }

            usersOnDb.push(userData);
        }

    

        res.status(200).json(usersOnDb)
    })




}




export default user;