// firebase.config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Analytics optional, uncomment if needed
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCpwGvHEnfEV6DuCGiEqB0-5nnuI-tdqpU",
  authDomain: "ai-routine-maker.firebaseapp.com",
  projectId: "ai-routine-maker",
  storageBucket: "ai-routine-maker.appspot.com", // fixed URL
  messagingSenderId: "704478512308",
  appId: "1:704478512308:web:562ed5e0b45e0b459043e1",
  measurementId: "G-EEGL7S2XV1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Optionally export app
export default app;
