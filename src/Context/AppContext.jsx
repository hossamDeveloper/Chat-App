import { createContext, useEffect, useState } from "react";
import { auth, db } from "../Config/Firebase";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";



export const AppContext = createContext();




const AppContextProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null);
    const [messageId, setMessageId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatUser, setChatUser] = useState(null);
    const [arrowAction, setArrowAction] = useState(false)
    const [showUserDetailsAndMedia, setShowUserDetailsAndMedia] = useState(false)

    const getUserData = async (uid) => {
        try {
            const userRef = doc(db, "users", uid);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();

            setUserData(userData);
            await updateDoc(userRef, { lastSeen: Date.now() })
            setInterval(async () => {
                if (auth.chatUser) {
                    await updateDoc(userRef, { lastSeen: Date.now() })
                }
            }, 10000);
        } catch (error) {

        }

    }


    useEffect(() => {
        if (userData) {
            const chatRef = doc(db, "chats", userData.id);
            const unSub = onSnapshot(chatRef, async (res) => {
                const chatItems = res.data().chatData;
                const tempData = [];
                for (const element of chatItems) {
                    const userRef = doc(db, "users", element.rId);
                    const userSnap = await getDoc(userRef);
                    const userData = userSnap.data();
                    tempData.push({ ...element, userData })
                };
                setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
            })
            return () => unSub();
        }
    }, [userData])



    return <AppContext.Provider value={{ userData, setUserData, chatData, setChatData, getUserData, messageId, setMessageId, messages, setMessages, chatUser, setChatUser , arrowAction, setArrowAction , showUserDetailsAndMedia , setShowUserDetailsAndMedia }}>{children}</AppContext.Provider>
}

export default AppContextProvider

