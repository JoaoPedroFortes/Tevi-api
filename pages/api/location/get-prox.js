import { loadFirebase } from '../../../lib/db.js'




async function location(req, res) {
    try {
        let proxLocation = [];

        return res.status(200).json(proxLocation)
    } catch (error) {
        console.log(error)
    }
}

function getUsersLocation(userID,longitude,latitude,dataHora){}

export default location;
