import React, { useContext, useState } from 'react'
import assets from './../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { db, logout } from '../../Config/Firebase';
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { AppContext } from '../../Context/AppContext';

const LeftSidebar = () => {
    const navigate = useNavigate();
    const { userData, chatData, chatUser, setChatUser, setMessageId, messageId , setArrowAction , arrowAction } = useContext(AppContext)
    const [user, setUser] = useState(null)
    const [showSearch, setShowSearch] = useState(false)

    const handleSearch = async (e) => {

        try {
            const term = e.target.value
            if (term) {
                setShowSearch(true)
                const userRef = collection(db, "users");

                const q = query(userRef, where("username", "==", term.toLowerCase()));

                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty && querySnapshot.docs[0].data().id !== userData.id) {
                    let userExist = false
                    chatData.map((chat) => {
                        if (chat.rId === querySnapshot.docs[0].data().id) {
                            userExist = true
                        }
                    })
                    if (!userExist) {
                        setUser(querySnapshot.docs[0].data())
                    }

                } else {
                    setUser(null)
                }
            } else {
                setShowSearch(false)
            }

        } catch (error) {
            console.log(error);

        }
    }




    const addChat = async () => {
        const messageRef = collection(db, "messages")
        const chatsRef = collection(db, "chats")
        try {
            const newMessageRef = doc(messageRef)
            await setDoc(newMessageRef, {
                createAt: serverTimestamp(),
                messages: []
            })
            await updateDoc(doc(chatsRef, user.id), {
                chatData: arrayUnion({

                    messageId: newMessageRef.id,
                    lastMessage: "",
                    rId: userData.id,
                    updatedAt: Date.now(),
                    messageSeen: true

                })
            })
            await updateDoc(doc(chatsRef, userData.id), {
                chatData: arrayUnion({
                    messageId: newMessageRef.id,
                    lastMessage: "",
                    rId: user.id,
                    updatedAt: Date.now(),
                    messageSeen: true
                })
            })
            setShowSearch(false)

        } catch (error) {
            console.log(error);

        }
    }



    const setChat = async (user) => {
        try {
            setChatUser(user)
            setMessageId(user.messageId)
            const userChatRef = doc(db, "chats", userData.id)
            const userChatSnap = await getDoc(userChatRef)
            if (userChatSnap.exists()) {
                const userChatData = userChatSnap.data()
                if (Array.isArray(userChatData.chatData)) {
                    const chatIndex = userChatData.chatData.findIndex((chat) => chat.messageId === user.messageId)
                    if (chatIndex !== -1) {
                        userChatData.chatData[chatIndex].messageSeen = true
                    }
                    await updateDoc(userChatRef, {
                        chatData: userChatData.chatData
                    })
                }
            }
        } catch (error) {

        }

    }




    return (
        <>
            <div className={`${arrowAction ? "w-full md:w-3/5 ":"hidden md:block"}  md:w-2/5 xl:w-1/4  bg-[#001030] text-white`}>
                {/* top */}
                <div className='px-3 py-4'>
                    <div className='flex justify-between items-center relative group'>
                        <img src={assets.logo} alt="logo" className='w-[150px]' />
                        <img src={assets.menu_icon} alt="menuIcon" className='h-[20px] cursor-pointer opacity-65 hover:opacity-100 duration-300' />
                        <div className='absolute right-0 top-full bg-white p-2  text-black w-52 transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 duration-300'>
                            <p onClick={() => navigate("/profile")} className='text-[15px] cursor-pointer hover:translate-x-3 duration-300'>Edit profile</p>
                            <hr />
                            <p onClick={() => logout()} className='text-[15px] cursor-pointer hover:translate-x-3 duration-300'>Logout</p>
                        </div>
                    </div>
                    <div className='flex gap-3 items-center mt-5 bg-[#002670] p-2'>
                        <img src={assets.search_icon} alt="searchIcon" className='h-[15px]' />
                        <input onChange={handleSearch} type="text" placeholder='Search and add friends' className='w-full bg-transparent outline-none text-white placeholder:text-sm text-sm' />
                    </div>
                </div>

                {/* middle */}
                <div className='overflow-y-scroll h-[calc(100%-160px)]'>
                    {showSearch && user
                        ? <div onClick={addChat} className='h-[70px] cursor-pointer flex gap-2  p-3 border-b-2 border-[#002670] hover:bg-[#002670] duration-300 group'>
                            <div className='w-1/5'>
                                <img src={user.avatar} alt="pic1" className='w-[50px] h-[50px] rounded-full object-cover' />
                            </div>
                            <div className='w-4/5 flex flex-col'>
                                <p>{user.name}</p>
                                <span className='text-[15px] text-gray-400 group-hover:text-white duration-300'>how are you?</span>
                            </div>
                        </div>
                        : chatData.map((user) => (
                            <div key={user.messageId} onClick={() => {setChat(user); setArrowAction(false)}} className='h-[70px] cursor-pointer flex gap-2  p-3 border-b-2 border-[#002670] hover:bg-[#002670] duration-300 group'>
                                <div className=''>
                                    <img src={user.userData.avatar} alt="pic1" className='w-[50px] h-[50px] rounded-full object-cover' />
                                </div>
                                <div className=''>
                                    <p>{user.userData.name}</p>
                                    <span className={`text-[15px]  group-hover:text-white duration-300 ${user.messageSeen ? "text-gray-400" : "text-white"}`}>{chatData.find((chat) => chat.messageId === user.messageId).lastMessage}</span>
                                </div>
                            </div>
                        ))
                    }



                </div>
            </div>
        </>
    )
}

export default LeftSidebar