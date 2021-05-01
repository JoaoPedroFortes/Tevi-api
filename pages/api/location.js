import { loadFirebase } from '../../lib/db.js'
import getRawBody from 'raw-body'
const geofire = require('geofire-common');
//let firebase = await loadFirebase();
//let db = firebase.firestore().collection('users')


async function getInitialProps() {
    let firebase = await loadFirebase();
    let data = []
    let result = await new Promise((resolve, reject) => {
        firebase.firestore().collection('location')
            .limit(10)
            .get()
            .then(snapshot => {


                snapshot.forEach(doc => {
                    data.push(Object.assign({
                        id: doc.id
                    }, doc.data()))
                })

                resolve(data)


            }).catch(error => {
                reject([])
            })
    }).catch(error => {
        console.log(error)
    })
    console.log('ta safe')
    return data

}

async function location(req, res) {
    let firebase = await loadFirebase();
    if (req.method === 'POST') {
        try {


            const body = req.body
            const latitude = body.latitude;
            const longitude = body.longitude
            const point = new firebase.firestore.GeoPoint(latitude, longitude)
            const dataTimestamp = new Date(body.dataHora)

            const dataHora = new firebase.firestore.Timestamp.fromDate(dataTimestamp)


            const location = {
                userID: body.userId,
                dataHora: dataHora,
                point: point,
                geohash: geofire.geohashForLocation([point._lat, point._long]),

            }


            let updates = {};

            console.log(location)
            updates = location;
            res.setHeader('Content-Type', 'Application/Json');

            const upload = await firebase.firestore().collection('location').add(updates);

            return res.status(200).json(upload)



        } catch (error) {
            console.log(error)
        }

    } else if (req.method === 'GET') {
        try {
            const locationOnDb = []
            const locations = getInitialProps();
            locations.then(function (result) {
                console.log('res:', result)
                for (let i = 0; i < result.length; i++) {
                    let location = result[i];
                    const userID = location.userID;
                    const longitude = location.latitude;
                    const latitude = location.longitude;
                    const dataHora = new Date(location.dataHora.seconds * 1000)

                    const locationData = {
                        userID, longitude, latitude, dataHora
                    }

                    locationOnDb.push(locationData);
                }



                res.status(200).json(locationOnDb)
            })

        } catch (error) {
            console.log(error)
        }
    }

}




export default location;