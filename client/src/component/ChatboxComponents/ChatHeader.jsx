import React from 'react';
import { Phone, Video, MoreVertical, X } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) return null;

  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={selectedUser.avatar?.url || '/avatar.png'}
            alt={selectedUser.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
          {onlineUsers.includes(selectedUser._id) && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{selectedUser.name}</h3>
          <p className="text-sm text-gray-500">
            {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'} • @{selectedUser.username}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Phone className="w-5 h-5 text-gray-600" /></button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Video className="w-5 h-5 text-gray-600" /></button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><MoreVertical className="w-5 h-5 text-gray-600" /></button>
        <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-2"><X className="w-5 h-5 text-gray-600" /></button>
      </div>
    </div>
  );
};

export default ChatHeader;
