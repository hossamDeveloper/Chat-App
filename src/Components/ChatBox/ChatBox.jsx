import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../../assets/assets'
import { AppContext } from '../../Context/AppContext'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../Config/Firebase'
import { toast } from 'react-toastify'
import axios from 'axios'

const ChatBox = () => {
  const { userData, chatUser, messageId, messages, setMessages, setArrowAction, arrowAction, setShowUserDetailsAndMedia, showUserDetailsAndMedia } = useContext(AppContext)
  const [inputMessage, setInputMessage] = useState("")
  const [imageBeforeSend, setImageBeforeSend] = useState(null)

  const [image, setImage] = useState(null)
  const chatRef = useRef(null);


  const getImage = async (img) => {


    setImageBeforeSend(img)

    if (img) {
      const file = img;
      const dataImage = new FormData();
      dataImage.append('file', file);
      dataImage.append('upload_preset', 'profile-image');
      dataImage.append('cloud_name', 'elsanta');

      try {
        const { data } = await axios.post('https://api.cloudinary.com/v1_1/elsanta/image/upload', dataImage)
        console.log(data);
        setImage(data.url)
      } catch (error) {
        console.log(error);
      }
    }
  }

  const sendMessage = async () => {
    const messageRef = doc(db, "messages", messageId)
    try {
      if ((inputMessage && messageId) || (image && messageId)) {
        await updateDoc(messageRef, {
          messages: arrayUnion({
            sId: userData.id,
            ...(inputMessage ? { text: inputMessage } : { img: image }),
            createdAt: new Date()
          })
        })
        const userIDs = [chatUser.rId, userData.id]

        userIDs.forEach(async (id) => {
          const userChatRef = doc(db, "chats", id)
          const userChatSnap = await getDoc(userChatRef)
          if (userChatSnap.exists()) {
            const userChatData = userChatSnap.data()
            if (Array.isArray(userChatData.chatData)) {
              const chatIndex = userChatData.chatData.findIndex((chat) => chat.messageId === messageId)
              if (chatIndex !== -1) {
                userChatData.chatData[chatIndex].lastMessage = inputMessage ? inputMessage.slice(0, 20) : "image"
                userChatData.chatData[chatIndex].updatedAt = Date.now()
                userChatData.chatData[chatIndex].messageSeen = false
                await updateDoc(userChatRef, { chatData: userChatData.chatData })
              }
            }


          }
        })
      }
      setImage(null)
      setImageBeforeSend(null)
    } catch (error) {
      toast.error(error.message)
    }
    setInputMessage("")

  }


  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };


  const convertTime = (time) => {
    const date = time.toDate()
    const hours = date.getHours()
    let minutes = date.getMinutes()
    if (minutes < 10) {
      minutes = `0${date.getMinutes()}`
    } else {
      minutes = date.getMinutes()
    }

    if (hours > 12) {
      return `${hours - 12}:${minutes} PM`
    } else {
      return `${hours}:${minutes} AM`
    }

  }

  useEffect(() => {
    if (messageId) {
      const unSup = onSnapshot(doc(db, "messages", messageId), (res) => {
        setMessages(res.data().messages)
      })
      return () => {
        unSup()
      }
    }else{
      setMessages([])
    }


  }, [messageId, userData.id])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);


  return chatUser ? (
    <>
      <div className={`${arrowAction ? "hidden md:block" : "block"} ${showUserDetailsAndMedia ? "hidden md:block" : "block"} w-full md:w-3/5  xl:w-1/2 bg-[#f1f5ff] relative`}>
        {/* header image */}
        <div className='border-b-2 border-[#002670] flex justify-between px-3 items-center'>

          <div className='flex gap-2 items-center p-3'>
            <img onClick={() => setArrowAction(true)} src={assets.arrow} className='w-[30px] h-[30px] md:hidden cursor-pointer' alt="" />
            <img onClick={() => setShowUserDetailsAndMedia(true)} src={chatUser.userData.avatar} alt="" className='w-[50px] h-[50px] rounded-full object-cover cursor-pointer' />
            <p className='flex items-center gap-1 text-[20px]'>{chatUser.userData.name} {Date.now() - chatUser.userData.lastSeen <= 70000 ? <img src={assets.green_dot} alt="" /> : null}</p>
          </div>
          <img src={assets.help_icon} alt="" className='w-[30px] h-[30px] rounded-full object-cover cursor-pointer' />
        </div>
        {/* chat */}


        <div ref={chatRef} className='overflow-y-scroll h-[calc(100%-130px)] text-white scroll-smooth'>


          {messages.map((item, index) =>
            <div key={index} className={`flex  items-end  gap-2 justify-end px-3 py-3 ${item.sId === userData.id ? "flex-row" : "flex-row-reverse"}`}>
              <div className=''>

                {item?.img ? <img src={item?.img} alt="" className='w-[300px] rounded-[3px] object-cover' /> : <p className='break-words max-w-[200px] bg-[#077eff] p-2 rounded'>{item?.text}</p>}
              </div>

              <div className='flex flex-col justify-end items-center '>
                <img src={item.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" className='w-[50px] h-[50px] object-cover rounded-full' />
                <p className='text-gray-500 text-[12px]'>{convertTime(item.createdAt)}</p>
              </div>
            </div>
          )}

        </div>


        {/* input */}
        <div className='absolute bottom-0 left-0 right-0 bg-white'>
          {imageBeforeSend ? <>
            <div className='flex justify-between  px-3 py-1  gap-2'>
              <img src={URL.createObjectURL(imageBeforeSend)} alt="" className='w-full h-[300px]  object-cover' />
              <div onClick={() => { setImageBeforeSend(null); setImage(null) }} className='w-5 h-5 bg-gray-300 text-white rounded-full flex justify-center items-center cursor-pointer hover:bg-red-500 duration-300'>x</div>
            </div>
          </>
            : null}
          <div className=' flex justify-between items-center px-3 py-1  gap-2'>
            <input onKeyDown={handleKeyDown} onChange={(e) => setInputMessage(e.target.value)} value={inputMessage} type="text" placeholder='send message' className='w-full py-2 px-3 outline-none' />
            <label htmlFor="image">
              <input onChange={(e) => getImage(e.target.files[0])} type="file" id='image' className='hidden' />
              <img src={assets.gallery_icon} alt="" className='w-[30px]  object-cover cursor-pointer' />
            </label>
            <img tabIndex="0" onClick={sendMessage} src={assets.send_button} alt="" className='w-[35px]  object-cover cursor-pointer' />
          </div>
        </div>
      </div>
    </>
  ) : <>
    <div className={`${arrowAction ? "hidden md:block" : "block"} relative w-full md:w-3/5  xl:w-1/2 bg-[#f1f5ff] flex flex-col justify-center items-center`}>
      <img onClick={() => setArrowAction(true)} src={assets.arrow} className='w-[30px] h-[30px] md:hidden cursor-pointer absolute top-3 left-3' alt="" />
      <img src={assets.logo_icon} className='w-[100px]' alt="" />
      <p className='text-[22px]'>Chat with your friends</p>
    </div>
  </>
}

export default ChatBox