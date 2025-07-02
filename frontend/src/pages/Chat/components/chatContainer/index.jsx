import React from 'react'
import ChatHeader from './components/chatHeader'
import MessageBar from './components/messageBar'
import MessageContainer from "./components/messageContainer";

function ChatContainer() {
  return (
      <div className="fixed top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1 ">
          <ChatHeader />
          <MessageContainer />
          <MessageBar />
      </div>
  );
}

export default ChatContainer