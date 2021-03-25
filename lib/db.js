
import firebase from 'firebase/app'
import 'firebase/firestore'

export function loadFirebase() {

    try {
        const firebaseConfig = {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE_APP_ID
        };

        firebase.initializeApp(firebaseConfig);
        const settings = { timestampsInSnapshots: true }
        firebase.firestore().settings(settings)
        
    } catch (error) {
        if (!/already exists/.test(error.message)) {
            console.log('Firebase nao inicializou corretamente: $(error.messager)')
        }
    }
    return firebase
}