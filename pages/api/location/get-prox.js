import { loadFirebase } from '../../../lib/db.js'
const geofire = require('geofire-common');




async function location(req, res) {
    try {
        if (req.method === 'POST') {
            const userID = req.body.userId;
            const dataHora = req.body.dataHora;


            // generateHash('9aP4rvKR2LSIArFRW4cd');
            const result = await (getUsersLocation(userID, dataHora));

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

        return;
    }


    let latitude = '';
    let longitude = '';
    query.forEach((doc) => {
        latitude = doc.data().point._lat;
        longitude = doc.data().point._long;
    })


    let next = [];
    next = await getNextUsers(userId, dataHora, latitude, longitude);

    let matches = []

    matches = createObj(userId, next)

    console.log('lalala', + matches)
    return matches
}

let createObj = async (userId, next) => {

    const userMatches = []

    const arrId = []
    for (let c of next) {
        if (c.userID === userId) continue
        if (arrId.length && arrId.find(el => el === c.userID)) continue


        let id = c.userID

        arrId.push(id)
        console.log(c.avatar)
        let name = await getUserName(id);

        let obj = Object.assign({ id: id }, name)

        userMatches.push(obj)
    }

    let matches = await Promise.all(userMatches).then((response) => {
        return response
    })

    return matches
}

let getUserName = async (userId) => {

    let firebase = loadFirebase();

    let storage = firebase.storage();


    const userRef = firebase.firestore().collection('users');
    const query = await userRef.doc(userId).get();

    if (query.empty) {

        return [];
    }

    let obj = {
        name: query.data().name,
        avatar: query.data().avatar
    }
    return obj
}


async function getNextUsers(userId, dataHora, latitude, longitude) {
    let firebase = loadFirebase();

    let matchingDocs = [];

    const userPoint = [latitude, longitude];
    const radiusInM = 70;

    const bounds = geofire.geohashQueryBounds(userPoint, radiusInM);
    const promises = [];



    for (const b of bounds) {
        let locationRef = await firebase.firestore().collection('location')
        let q = await locationRef.orderBy('geohash').startAt(b[0]).endAt(b[1]).get();

        promises.push(q);

    }




    const match = await Promise.all(promises).then((snapshots) => {


        for (const snap of snapshots) {
            for (const doc of snap.docs) {
                let dataDoc = new Date(doc.get('dataHora').toDate());
                let data = new Date(dataHora)

                if (dataDoc.getUTCMonth() === data.getUTCMonth() && dataDoc.getDate() === dataDoc.getDate()) {
                    const lat = doc.get('point')._lat;
                    const lng = doc.get('point')._long;



                    const distanceInKm = geofire.distanceBetween([lat, lng], userPoint)
                    const distanceInM = distanceInKm * 1000;

                    if (distanceInM <= radiusInM) {
                        matchingDocs.push(doc.data());
                    }
                }
            }

        }

        return matchingDocs

    })


    return match


}

export default location;

