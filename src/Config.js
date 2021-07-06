import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBJQy_LXN3ZchdusOIoKHCUpiuXA4-tQ20",
  authDomain: "blipblop-650f1.firebaseapp.com",
  projectId: "blipblop-650f1",
  storageBucket: "blipblop-650f1.appspot.com",
  messagingSenderId: "815296360185",
  appId: "1:815296360185:web:b8a13e38c9e17afbe9bc28",
  measurementId: "G-GTFX3BG0CR",
  databaseURL:
    "https://blipblop-650f1-default-rtdb.asia-southeast1.firebasedatabase.app",
};

firebase.initializeApp(firebaseConfig);
export default firebaseConfig;
