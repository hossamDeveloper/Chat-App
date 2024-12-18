// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBEvtARmuqFltwKscez1kvpVAvTFU_zZPg",
    authDomain: "chat-app-hs-28038.firebaseapp.com",
    projectId: "chat-app-hs-28038",
    storageBucket: "chat-app-hs-28038.firebasestorage.app",
    messagingSenderId: "338161783493",
    appId: "1:338161783493:web:53853f1c4de4cd66c796ac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);



const signUp = async (username, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            username: username.toLowerCase(),
            email,
            name: "",
            avatar: "",
            bio: "hello i am using chat app",
            lastSeen: Date.now()
        })
        await setDoc(doc(db, "chats", user.uid), {
            chatData: []
        })
        toast.success("Account created successfully")
    } catch (error) {
        console.error(error)
        toast.error(error.code)
    }
}


const logIn = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Logged in successfully")
    } catch (error) {
        console.error(error)
        toast.error(error.code)
    }
}


const logout = async () => {
    try {
        await signOut(auth);
        toast.success("Logged out successfully")
    } catch (error) {
        console.error(error)
        toast.error(error.code)
    }
}

export { signUp , logIn , logout , auth , db}