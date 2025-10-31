// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Correct Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFVg0eMwnxOTQzjugM0R6_RJeiIZspj7o",
  authDomain: "smarthealthassistant-d8643.firebaseapp.com",
  projectId: "smarthealthassistant-d8643",
  storageBucket: "smarthealthassistant-d8643.appspot.com", // ✅ fixed here
  messagingSenderId: "315234803893",
  appId: "1:315234803893:web:4e9c34a1e215a782269efc"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
