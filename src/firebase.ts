import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA9KnW-r2imZDJ11dHSCVrBnieKsXmZlpQ",
  authDomain: "pcs-ai-studio.firebaseapp.com",
  projectId: "pcs-ai-studio",
  storageBucket: "pcs-ai-studio.firebasestorage.app",
  messagingSenderId: "272926811473",
  appId: "1:272926811473:web:aa5ad140e9bd24b4249f70",
  measurementId: "G-GYWPZWGXNM"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
