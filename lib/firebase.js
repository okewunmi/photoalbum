// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import app from "./firebaseConfig"; // Import your Firebase app initialization

const firebaseConfig = {
  apiKey: "AIzaSyCr4KOOPGk76766mqenHZRCqULNDXEYUQk",
  authDomain: "imageo-84fb4.firebaseapp.com",
  projectId: "imageo-84fb4",
  storageBucket: "imageo-84fb4.firebasestorage.app",
  messagingSenderId: "403584687698",
  appId: "1:579380055728:android:e1fbfbfa3bb54a8d03b575",
  measurementId: "G-5560J5H43R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, auth, storage, GoogleAuthProvider, signInWithPopup, signOut };
