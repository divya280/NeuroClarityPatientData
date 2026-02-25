import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAM1-WKAa_gymUhxKs1fsljvww-HZD7hXw",
  authDomain: "patientdata-cfbbe.firebaseapp.com",
  projectId: "patientdata-cfbbe",
  storageBucket: "patientdata-cfbbe.firebasestorage.app",
  messagingSenderId: "83975107330",
  appId: "1:83975107330:web:f5ce42470c197e30a7c81b",
  measurementId: "G-M2B7DVK615"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
