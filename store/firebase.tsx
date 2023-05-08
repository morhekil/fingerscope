import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdIicor5wq2Bv2c-dxsFQ27VQM_5wmLxY",
  authDomain: "fingercomps-lite-au.firebaseapp.com",
  databaseURL: "https://fingercomps-lite-au.firebaseio.com",
  projectId: "fingercomps-lite-au",
  storageBucket: "fingercomps-lite-au.appspot.com",
  messagingSenderId: "889827328281",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };
