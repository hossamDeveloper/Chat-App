import React, { useContext, useEffect, useState } from 'react'
import LeftSidebar from '../../Components/LeftSidebar/LeftSidebar'
import RightSidebar from '../../Components/RightSidebar/RightSidebar'
import ChatBox from '../../Components/ChatBox/ChatBox'
import { AppContext } from '../../Context/AppContext'

const Chat = () => {
  const { userData, chatData } = useContext(AppContext)
  const [lodding, setLodding] = useState(true)



  useEffect(() => {
    if (userData && chatData) {
      setLodding(false)
    }
  }, [userData, chatData])

  return (
    <>
      <div className='bg-[linear-gradient(#596aff,#383699)] h-[100vh] flex justify-center items-center '>
        {
          lodding ? <div>lodding...</div> : <div className='bg-blue-100 w-full sm:w-4/5 md:w-3/4 h-full sm:h-4/5 md:h-3/4 flex  justify-between'>
            <LeftSidebar />
            <ChatBox />
            <RightSidebar />
          </div>
        }
      </div>
    </>
  )
}

export default Chat