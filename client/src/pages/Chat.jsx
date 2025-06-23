import React from 'react'
import ChatList from '../component/ChatList'
import ChatBox from '../component/ChatBox'

const Chat = () => {
  return (
    <div>
        <ChatList/>
        <ChatBox/>
        <Profile/>
    </div>
  )
}

export default Chat