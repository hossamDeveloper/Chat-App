import React, { useContext, useEffect, useState } from 'react'
import assets from '../../assets/assets'
import { logout } from '../../Config/Firebase'

import { AppContext } from './../../Context/AppContext';

const RightSidebar = () => {
  const { chatUser, messages, setShowUserDetailsAndMedia, showUserDetailsAndMedia , userData} = useContext(AppContext)
  const [mediaImage, setMediaImage] = useState([])
  useEffect(() => {
    let images = []
    messages.map((message) => {
      if (message.img ) {
        images.push(message.img)
      }
      setMediaImage(images)
    })
  }, [messages])
  return chatUser ? (
    <>
      <div className={`${showUserDetailsAndMedia ? 'block w-full ' : 'hidden'} md:hidden xl:block xl:w-1/4 bg-[#001030] text-white relative`}>
      <img onClick={() => setShowUserDetailsAndMedia(false)} src={assets.arrow} className='w-[30px] h-[30px] md:hidden cursor-pointer absolute top-3 left-3' alt="" />
        {/* header image */}
        <div className='flex flex-col items-center px-3 pt-10 pb-5 gap-2 border-b-2 border-[#002670]'>
          <img src={chatUser.userData.avatar} alt="" className='w-[100px] h-[100px] rounded-full object-cover' />
          <p className='flex items-center gap-1 text-[20px]'>{chatUser.userData.name} {Date.now()-chatUser.userData.lastSeen <= 70000 ? <img src={assets.green_dot} alt="" /> : null}</p>
          <p className='text-[12px] text-center text-gray-400'>{chatUser.userData.bio}</p>
        </div>
        <div className='p-3'>
          <h2>Media</h2>
          <div className='overflow-y-scroll h-[180px] '>
            <div className='flex flex-wrap'>
              {mediaImage.map((image, index) =>
                <div key={index} className='w-1/3 p-1'>
                  <img src={image} className='w-full h-[80px] object-cover' alt="" />
                </div>
              )}



            </div>

          </div>
        </div>
        <button onClick={() => logout()} className='absolute bottom-3 left-2 right-2 py-2 bg-[#002670] hover:text-red-500 duration-300'>logout</button>
      </div>
    </>
  ) : (<>
    <div className='hidden xl:block xl:w-1/4 bg-[#001030] text-white relative'>
      <button onClick={() => logout()} className='absolute bottom-3 left-2 right-2 py-2 bg-[#002670] hover:text-red-500 duration-300'>logout</button>
    </div>
  </>)
}

export default RightSidebar