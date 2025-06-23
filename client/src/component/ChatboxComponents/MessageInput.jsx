import React, { useEffect, useRef, useState } from 'react';
import { SendHorizonal, ImagePlus } from 'lucide-react';
import { useSocket } from '@/context/socketContext';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const imageInputRef = useRef(null);

  const { socket } = useSocket();
  const { authUser } = useAuthStore();
  const { selectedUser, sendMessage } = useChatStore();

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (message) => {
        if (message.senderId === selectedUser._id) {
          sendMessage(message);
        }
      });
    }

    return () => {
      socket?.off('newMessage');
    };
  }, [socket, selectedUser]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const toastId = toast.loading('Uploading...');
    try {
      const data = await uploadToCloudinary(file);
      setImage(data?.url);
    } catch (err) {
      console.error(err);
      toast.error('Upload failed');
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !image) return;

    const newMessage = {
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: message,
      image,
    };

    socket?.emit('sendMessage', newMessage);
    sendMessage({ ...newMessage, createdAt: new Date().toISOString() });
    setMessage('');
    setImage(null);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 border-t border-gray-200 flex items-center gap-4">
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        hidden
        ref={imageInputRef}
        onChange={handleImageChange}
      />

      <button
        type="button"
        onClick={() => imageInputRef.current.click()}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <ImagePlus className="w-5 h-5 text-gray-600" />
      </button>

      <button
        type="submit"
        disabled={!message.trim() && !image}
        className="p-2 hover:bg-blue-100 rounded-full transition-colors disabled:opacity-50"
      >
        <SendHorizonal className="w-5 h-5 text-blue-600" />
      </button>
    </form>
  );
};

export default MessageInput;
