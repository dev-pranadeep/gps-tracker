import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyABdSwIeriTTxHa-KEn1gFwNTlU-NS5pk0",
  authDomain: "authproject-945be.firebaseapp.com",
  projectId: "authproject-945be",
  storageBucket: "authproject-945be.firebasestorage.app",
  messagingSenderId: "564867329336",
  appId: "1:564867329336:web:9e391b30efe88bf3db65cd",
  measurementId: "G-ZC7ZGJGYPX"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);