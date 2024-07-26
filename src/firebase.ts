// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKecsMMQst1zeWjA7wgyUZnkLIY43zPUw",
  authDomain: "react-notes-60fd0.firebaseapp.com",
  projectId: "react-notes-60fd0",
  storageBucket: "react-notes-60fd0.appspot.com",
  messagingSenderId: "771329909944",
  appId: "1:771329909944:web:770f7922a720df02ca004d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore database instance
export const db = getFirestore(app);
export const notesCollection = collection(db, "notes")