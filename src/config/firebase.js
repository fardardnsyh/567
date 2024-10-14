import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBGNttgD-LmD0uRHvqbL-QS66tRxuRHFo4",
  authDomain: "secreto-c9250.firebaseapp.com",
  projectId: "secreto-c9250",
  storageBucket: "secreto-c9250.appspot.com",
  messagingSenderId: "136853086182",
  appId: "1:136853086182:web:6c7d3d21d5fbbddc008027",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
