import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAw0MMrO-vqdlJQ3sbFuQ4u5OGMiNiQhSY",
  authDomain: "maalam-fitness-challenge.firebaseapp.com",
  projectId: "maalam-fitness-challenge",
  storageBucket: "maalam-fitness-challenge.firebasestorage.app",
  messagingSenderId: "907444547852",
  appId: "1:907444547852:web:30d06b7d737798bf439929"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);