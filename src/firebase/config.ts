import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBir93FINYYhBOnMCV0Qh2blD99r-ivOEQ",
  authDomain: "cronograma-b86f3.firebaseapp.com",
  projectId: "cronograma-b86f3",
  storageBucket: "cronograma-b86f3.firebasestorage.app",
  messagingSenderId: "914539081430",
  appId: "1:914539081430:web:e6ff59ae313ca01dd42377"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;