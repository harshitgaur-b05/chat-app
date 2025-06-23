import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      console.error("Error fetching users:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch users";
      toast.error(errorMessage);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    if (!userId) {
      console.error("No userId provided to getMessages");
      return;
    }

    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.error("Error fetching messages:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch messages";
      toast.error(errorMessage);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    
    if (!selectedUser) {
      toast.error("No user selected");
      return;
    }

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to send message";
      toast.error(errorMessage);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    
    if (!socket) {
      console.error("Socket not available");
      return;
    }

    // Listen for new messages
    socket.on("newMessage", (newMessage) => {
      const { selectedUser: currentSelectedUser } = get();
      const authUser = useAuthStore.getState().authUser;
      
      // Show message if it's part of the conversation with the currently selected user
      const isRelevantMessage = 
        (newMessage.senderId === currentSelectedUser?._id && newMessage.receiverId === authUser?._id) ||
        (newMessage.senderId === authUser?._id && newMessage.receiverId === currentSelectedUser?._id);
      
      if (isRelevantMessage) {
        set({
          messages: [...get().messages, newMessage],
        });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  setSelectedUser: (selectedUser) => {
    // Clear messages when switching users
    set({ selectedUser, messages: [] });
  },

  // Helper function to clear chat data
  clearChat: () => {
    set({
      messages: [],
      selectedUser: null,
    });
  },
}));