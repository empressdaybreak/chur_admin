import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBNEYIVUmyd3lnwJIRcn4lV6xdVOKPw_Uw",
    authDomain: "chur-admin.firebaseapp.com",
    projectId: "chur-admin",
    storageBucket: "chur-admin.appspot.com",
    messagingSenderId: "1072007036126",
    appId: "1:1072007036126:web:9cb06f1941d45adbc9964f"
}

const app = initializeApp(firebaseConfig);

export const authService = getAuth();
export const dbService = getFirestore(app);