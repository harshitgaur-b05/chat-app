import { useEffect, useState } from "react"; 
import {useChatStore} from "../../store/useChatStore"
import { useAuthStore } from "../../store/useAuthStore"
import { Users } from "lucide-react";  

const AddMenbers = () => {   
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();    
  const { onlineUsers } = useAuthStore();   
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);    

  useEffect(() => {     
    getUsers(); 
    console.log(users);
      
  }, [getUsers]);    

  const filteredUsers = showOnlineOnly     
    ? users.filter((user) => onlineUsers.includes(user._id))     
    : users;    

  if (isUsersLoading) return (
    <div className="h-full w-20 lg:w-72 bg-[#191a1a] border-r border-white/15 flex items-center justify-center">
      <span className="text-white text-sm">Loading...</span>
    </div>
  );    

  return (     
    <aside className="h-full w-20 lg:w-72 bg-[#191a1a] border-r border-white/15 flex flex-col transition-all duration-200">       
      <div className="border-b border-white/15 w-full p-5">         
        <div className="flex items-center gap-2">           
          <Users className="size-6 text-blue-400" />           
          <span className="font-medium hidden lg:block text-white">Contacts</span>         
        </div>         
        
       
        <div className="mt-3 hidden lg:flex items-center gap-2">           
          <label className="cursor-pointer flex items-center gap-2">             
            <input               
              type="checkbox"               
              checked={showOnlineOnly}               
              onChange={(e) => setShowOnlineOnly(e.target.checked)}               
              className="w-4 h-4 text-blue-600 bg-gray-300 border-gray-300 rounded focus:ring-blue-500"             
            />             
            <span className="text-sm text-white/80">Show online only</span>           
          </label>           
          <span className="text-xs text-white/60">({onlineUsers.length - 1} online)</span>         
        </div>       
      </div>        

      <div className="overflow-y-auto w-full py-3 flex-1">         
        {filteredUsers.map((user) => (           
          <button             
            key={user._id}             
            onClick={() => setSelectedUser(user)}             
            className={`               
              w-full p-3 flex items-center gap-3               
              hover:bg-white/10 transition-colors               
              ${selectedUser?._id === user._id ? "bg-blue-600/20 border-l-2 border-blue-400" : ""}             
            `}           
          >             
            <div className="relative mx-auto lg:mx-0">               
              <img                 
                src={user.avatar?.url || "/avatar.png"}                 
                alt={user.name}                 
                className="size-12 object-cover rounded-full border border-white/20"               
              />               
              {onlineUsers.includes(user._id) && (                 
                <span                   
                  className="absolute bottom-0 right-0 size-3 bg-green-500                    
                  rounded-full ring-2 ring-[#191a1a]"                 
                />               
              )}             
            </div>              

            {/* User info - only visible on larger screens */}             
            <div className="hidden lg:block text-left min-w-0 flex-1">               
              <div className="font-medium truncate text-white">{user.name}</div>               
              <div className="text-sm text-white/60 truncate">@{user.username}</div>
              <div className="text-xs text-white/40">                 
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}               
              </div>             
            </div>           
          </button>         
        ))}          

        {filteredUsers.length === 0 && (           
          <div className="text-center text-white/60 py-8">
            <Users className="size-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              {showOnlineOnly ? "No online users" : "No contacts found"}
            </p>
          </div>         
        )}       
      </div>     
    </aside>   
  ); 
}; 

export default AddMenbers;