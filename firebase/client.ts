// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBPPcqFBroQAu5mPqzvN9dGJc_XyT14OR0",
    authDomain: "prepview-21fe0.firebaseapp.com",
    projectId: "prepview-21fe0",
    storageBucket: "prepview-21fe0.firebasestorage.app",
    messagingSenderId: "727158724850",
    appId: "1:727158724850:web:2e1a9fcd734dd3f264586b",
    measurementId: "G-BTWSJV3YRQ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);