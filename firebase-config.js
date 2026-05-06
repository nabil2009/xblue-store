// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAUbpzyuACWNlDIkfe_A47sSQd_We41Gbk",
  authDomain: "my-marketplace-c2cd7.firebaseapp.com",
  databaseURL: "https://my-marketplace-c2cd7-default-rtdb.firebaseio.com",
  projectId: "my-marketplace-c2cd7",
  storageBucket: "my-marketplace-c2cd7.firebasestorage.app",
  messagingSenderId: "649905836994",
  appId: "1:649905836994:web:3e3d83a093c5216838fc5b",
  measurementId: "G-WLSWQFPM8M"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);