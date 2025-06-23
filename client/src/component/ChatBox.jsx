import React, { useState, useEffect, useRef } from 'react';
import { Send, Image, Smile, Phone, Video, MoreVertical, X } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';

// Utility function to format message time
const formatMessageTime = (date) => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInHours = (now - messageDate) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    return messageDate.toLocaleDateString();
  }
};

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) return null;

  return (
    <div 
      className="bg-black  rounded-2xl  p-4 flex items-center justify-between shadow-lg flex-shrink-0"
      style={{
        
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
      }}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={selectedUser.avatar?.url || '/avatar.png'}
            alt={selectedUser.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
          />
          {onlineUsers.includes(selectedUser._id) && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border-2 border-black rounded-full"></div>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-white">{selectedUser.name}</h3>
          <p className="text-sm text-white">
            {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'} • @{selectedUser.username}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {/* <button className="p-2 hover:bg-white hover:text-black rounded-full transition-colors">
          <Phone className="w-5 h-5 text-white" />
        </button>
        <button className="p-2 hover:bg-white hover:text-black rounded-full transition-colors">
          <Video className="w-5 h-5 text-white" />
        </button>
        <button className="p-2 hover:bg-white hover:text-black rounded-full transition-colors">
          <MoreVertical className="w-5 h-5 text-white" />
        </button> */}
        <button 
          onClick={() => setSelectedUser(null)}
          className="p-2 hover:bg-white hover:text-black rounded-full transition-colors ml-2"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

const MessageInput = () => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const { selectedUser, sendMessage } = useChatStore();
  const fileInputRef = useRef(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedImage) || !selectedUser) return;

    try {
      const messageData = {};
      
      if (newMessage.trim()) {
        messageData.text = newMessage;
      }
      
      if (selectedImage) {
        messageData.image = selectedImage;
      }

      await sendMessage(messageData);
      setNewMessage('');
      setSelectedImage(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-black text-amber-700 border-t rounded-b-3xl border-gray-200 p-4 flex-shrink-0">
      {selectedImage && (
        <div className="mb-3 relative inline-block">
          <img 
            src={selectedImage} 
            alt="Selected" 
            className="max-w-xs max-h-32 rounded-lg border border-gray-300"
          />
          <button
            onClick={removeSelectedImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
        >
          <Image className="w-5 h-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        <div className="flex-1 relative text-amber-50">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
            placeholder="Type a message..."
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {/* <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Smile className="w-4 h-4 text-gray-500" />
          </button> */}
        </div>

        <button
          onClick={handleSendMessage}
          disabled={!newMessage.trim() && !selectedImage}
          className="p-2 bg-blue-500 text-black rounded-full hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }

    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messagesEndRef.current && messages) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col min-h-0">
        <ChatHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading messages...</p>
          </div>
        </div>
        <MessageInput />
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-700">
        <div className="text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="w-12 h-12 text-blue-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Start a Conversation</h2>
          <p className="text-gray-500 mb-4">Select a contact from the sidebar to begin chatting</p>
          <div className="text-sm text-gray-400">
            Click on any user to start messaging them instantly
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" flex flex-col mt-5 rounded-2xl bg-gray-900 " style={
      {
        height:"75vh",
        width:"40vw",

      }
    }>
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4 break-words">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No messages yet</p>
            <p className="text-sm text-gray-400 mt-1">Start the conversation by sending a message below</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${message.senderId === authUser._id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end gap-2 max-w-xs lg:max-w-md ${
                message.senderId === authUser._id ? 'flex-row-reverse' : 'flex-row'
              }`}>
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.avatar?.url || '/avatar.png'
                      : selectedUser.avatar?.url || '/avatar.png'
                  }
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />

                <div className={`rounded-2xl px-4 py-2 break-words max-w-full sm:max-w-xs md:max-w-md lg:max-w-lg ${
  message.senderId === authUser._id
    ? 'bg-blue-500 text-white'
    : 'bg-white text-gray-800 border border-gray-200'
}`}>
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Shared image"
                      className="max-w-full rounded-lg mb-2 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(message.image, '_blank')}
                    />
                  )}
                  
                  {message.text && (
                    <p className="break-words">{message.text}</p>
                  )}
                  
                  <p className={`text-xs mt-1 ${
                    message.senderId === authUser._id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatMessageTime(message.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;