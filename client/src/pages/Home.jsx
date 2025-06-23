import React from 'react'
import ChatList from '../component/ChatList'
import Profile from '../component/Profile'
import ChatContainer from '../component/ChatBox'
const Home = () => {
  return (
    <div className='flex justify-between gap-1'>
<ChatList/>
<ChatContainer/>
<Profile/>
    </div>
  )
}

export default Home