import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { UserData } from '@/context/UserContext';

const SOCKET_URL = "https://frixle-backend.onrender.com";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const { user } = UserData();

  // Socket initialization
  useEffect(() => {
    if (!user?._id) return;

    const newSocket = io(SOCKET_URL, {
      query: { userId: user._id }
    });

    newSocket.on("connect", () => {
      console.log("Socket connected successfully");
    });

    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    newSocket.on("newMessage", (message) => {
      if (message.sender !== user._id) {
        setMessages(prev => [...prev, message]);
        updateChatWithLatestMessage(message);
      }
    });

    newSocket.on("userTyping", ({ chatId, userId, isTyping }) => {
      if (userId !== user._id) {
        setTypingUsers(prev => ({
          ...prev,
          [chatId]: isTyping
        }));
      }
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [user?._id]);

  // Update chat list with latest message
  const updateChatWithLatestMessage = (message) => {
    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat._id === message.chat) {
          return {
            ...chat,
            latestMessage: {
              text: message.text,
              sender: message.sender
            }
          };
        }
        return chat;
      });
    });
  };

  const handleSendMessage = async ({ text, receiverId, messageObj }) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/chats`, {
        text,
        recieverId: receiverId
      },{ withCredentials: true });

      setMessages(prev => 
        prev.map(msg => 
          msg._id === messageObj._id ? { ...data, chat: selectedChat._id } : msg
        )
      );

      updateChatWithLatestMessage({
        chat: selectedChat._id,
        text,
        sender: user._id
      });

      if (socket) {
        socket.emit('newMessage', {
          receiverId,
          message: data
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove the temporary message if sending fails
      setMessages(prev => prev.filter(msg => msg._id !== messageObj._id));
    }
  };

  // Fetch all chats
  const fetchChats = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/chats/all`,{ withCredentials: true });
      setChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch messages for a chat
  const fetchMessages = async (userId) => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/chats/${userId}`,{ withCredentials: true });
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset chat state
  const resetChatState = () => {
    setSelectedChat(null);
    setMessages([]);
    setTypingUsers({});
  };

  const value = {
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    messages,
    setMessages,
    socket,
    onlineUsers,
    isLoading,
    typingUsers,
    handleSendMessage,
    fetchChats,
    fetchMessages,
    resetChatState,
      updateChatWithLatestMessage,
      currentUser: user
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Custom hook to use chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};