import React from 'react';
import { Send } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';

const formatMessageTime = (date) => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInHours = (now - messageDate) / (1000 * 60 * 60);

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return messageDate.toLocaleDateString();
};

const MessageBubble = ({ message }) => {
  const { authUser } = useAuthStore();
  const { selectedUser } = useChatStore();

  const isSender = message.senderId === authUser._id;

  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-end gap-2 max-w-full sm:max-w-xs md:max-w-md lg:max-w-lg ${isSender ? 'flex-row-reverse' : 'flex-row'}`}>
        <img
          src={isSender ? authUser.avatar?.url || '/avatar.png' : selectedUser.avatar?.url || '/avatar.png'}
          alt="Avatar"
          className="w-8 h-8 rounded-full object-cover border border-gray-200"
        />
        <div className={`rounded-2xl px-4 py-2 break-words max-w-full sm:max-w-xs md:max-w-md lg:max-w-lg ${
          isSender ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border border-gray-200'
        }`}>
          {message.image && (
            <img
              src={message.image}
              alt="Shared"
              className="max-w-full rounded-lg mb-2 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(message.image, '_blank')}
            />
          )}
          {message.text && <p>{message.text}</p>}
          <p className={`text-xs mt-1 ${isSender ? 'text-blue-100' : 'text-gray-500'}`}>{formatMessageTime(message.createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
