import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCI1mNarUnORJX7HKeeLTK_LH-wZCQK8_A",
    authDomain: "bus-tracking-9fee8.firebaseapp.com",
    projectId: "bus-tracking-9fee8",
    storageBucket: "bus-tracking-9fee8.firebasestorage.app",
    messagingSenderId: "643396122319",
    appId: "1:643396122319:web:6905fadee4367c2a02a9ba"
  };

   const app = initializeApp(firebaseConfig);

  const db = getFirestore(app);

  const BusFirebase = collection(db, "buses");

  export {BusFirebase};