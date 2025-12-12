// TODO: Add your Firebase configuration keys here
// You can copy this object from your Firebase Console > Project Settings > General > Your apps > SDk setup and configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOiHH1tU2RLr8S-dlRhgjGxffVV_9nM9Y",
  authDomain: "familysync-216d2.firebaseapp.com",
  projectId: "familysync-216d2",
  storageBucket: "familysync-216d2.firebasestorage.app",
  messagingSenderId: "323541274740",
  appId: "1:323541274740:web:a05d8737e3b35fa4c0c121"
};

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
