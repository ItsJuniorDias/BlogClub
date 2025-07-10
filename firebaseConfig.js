import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyD_4r0LCsoQ3n2Bxw2sh-i-pVRFbSsQ66A",
  authDomain: "blog-club-71bb2.firebaseapp.com",
  projectId: "blog-club-71bb2",
  storageBucket: "blog-club-71bb2.firebasestorage.app",
  messagingSenderId: "928622657055",
  appId: "1:928622657055:web:e0276a0e1f1be6a4571f2a",
  measurementId: "G-7EW2LM8WSN",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { db, auth };
