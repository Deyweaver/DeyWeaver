
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDhUpRlDlZIp0SqWEqMCh7VeV2mP1TLYoI",
  authDomain: "aln-communitty-hub.firebaseapp.com",
  projectId: "aln-communitty-hub",
  storageBucket: "aln-communitty-hub.firebasestorage.app",
  messagingSenderId: "708469747493",
  appId: "1:708469747493:web:a31fc9ff38ae04d2ce34cc",
  measurementId: "G-BGPQQJZCW2"
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
