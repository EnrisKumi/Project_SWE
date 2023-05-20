
import { initializeApp } from "firebase/app";

import {getFirestore} from 'firebase/firestore'


const firebaseConfig = {
    apiKey: "AIzaSyAc5CBG_4X73ZIqx32KVrS_oXaUdG_gh4w",
    authDomain: "chat-65a0d.firebaseapp.com",
    projectId: "chat-65a0d",
    storageBucket: "chat-65a0d.appspot.com",
    messagingSenderId: "984850922113",
    appId: "1:984850922113:web:ebce537607b31dd1066b80"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)