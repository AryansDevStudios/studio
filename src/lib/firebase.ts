import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDmR4ea5JXBtkBatU2-TmQ-jlSpXUsWRUc",
  authDomain: "tictactoe-meet.firebaseapp.com",
  projectId: "tictactoe-meet",
  storageBucket: "tictactoe-meet.firebasestorage.app",
  messagingSenderId: "337411327491",
  appId: "1:337411327491:web:de52d84bc2f7fada02b036",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
