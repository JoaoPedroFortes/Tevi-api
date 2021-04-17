import { loadFirebase } from '../../../lib/db.js'
const geofire = require('geofire-common');




async function location(req, res) {
    try {
        if (req.method === 'POST') {
            const userID = req.body.userId;
            const dataHora = req.body.dataHora;


            // generateHash('9aP4rvKR2LSIArFRW4cd');
            const result = await (getUsersLocation(userID, dataHora));
            console.log("res: ", await result)
            res.status(200).json(result);
        } else {
            res.status(500).json(new Date().getDate())
        }
    } catch (error) {
        console.log(error)
    }
}

async function generateHash(id) {
    let firebase = loadFirebase();
    const locationRef = firebase.firestore().collection('location').doc(id);

    let userLocation = (await locationRef.get()).data();

    let lat = userLocation.point._lat;
    let long = userLocation.point._long;

    const hash = geofire.geohashForLocation([lat, long])

    locationRef.update(
        {
            geohash: hash
        }
    )

}

async function getUsersLocation(userId, dataHora) {
    let firebase = loadFirebase();

    const locationRef = firebase.firestore().collection('location');
    const dataHoraDate = new Date(dataHora);
    const query = await locationRef.where("userID", "==", userId).where("dataHora", "==", dataHoraDate).get();

    if (query.empty) {
        console.log("nenhum encontrado");
        return;
    }


    let latitude = '';
    let longitude = '';
    query.forEach((doc) => {
        console.log("query: ", doc.data())
        latitude = doc.data().point._lat;
        longitude = doc.data().point._long;
    })


    console.log('lat: ', latitude);
    console.log('long:', longitude);
    console.log('userId: ', userId);
    const next = await getNextUsers(userId, dataHora, latitude, longitude);

    console.log('next: ', next)


    return next
}

async function getNextUsers(userId, dataHora, latitude, longitude) {
    let firebase = loadFirebase();

    const userPoint = [latitude, longitude];
    const radiusInM = 70;

    const bounds = geofire.geohashQueryBounds(userPoint, radiusInM);
    const promises = [];



    for (const b of bounds) {
        let locationRef = await firebase.firestore().collection('location')
        let q = await locationRef.orderBy('geohash').startAt(b[0]).endAt(b[1]).get();

        promises.push(await q);

    }




    Promise.all(promises).then((snapshots) => {
        let matchingDocs = [];

        for (const snap of snapshots) {
            for (const doc of snap.docs) {
                let dataDoc =doc.get('dataHora').toDate().toLocaleString();
                let data = new Date(dataHora).toLocaleString()
               
                if (dataDoc === data) {
                    const lat = doc.get('point')._lat;
                    const lng = doc.get('point')._long;

                    console.log("lat: " + lat);
                    console.log("lng: " + lng);

                    const distanceInKm = geofire.distanceBetween([lat, lng], userPoint)
                    const distanceInM = distanceInKm * 1000;

                    if (distanceInM <= radiusInM) {
                        matchingDocs.push(doc.data());
                    }
                }
            }

        }


        for (const doc of matchingDocs) {
            console.log("docs:", doc)
        }



        return matchingDocs;


    })
}

export default location;

/*
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
                console.log('vou retornar')
                console.log(data)

            }


*/