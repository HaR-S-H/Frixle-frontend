import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Send, Users, ChevronLeft } from "lucide-react";
import axios from 'axios';
import { io } from 'socket.io-client';
import { UserData } from '@/context/UserContext';
import MainLayout from '@/layout/MainLayout';
import { useTheme } from "@/context/ThemeContext";
import { Link } from 'react-router-dom';
const SOCKET_URL = "https://frixle-backend.onrender.com";

function ChatPage() {
const [chats, setChats] = useState([]);
const [selectedChat, setSelectedChat] = useState(null);
const [messages, setMessages] = useState([]);
const [newMessage, setNewMessage] = useState('');
const [users, setUsers] = useState([]);
const [searchQuery, setSearchQuery] = useState('');
const [socket, setSocket] = useState(null);
const [onlineUsers, setOnlineUsers] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [showSidebar, setShowSidebar] = useState(true);
const messagesEndRef = useRef(null);
const touchStartX = useRef(null);
    const { user } = UserData();
    const { theme } = useTheme();

    const isDark = theme === "dark";
const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
};

const handleTouchMove = (e) => {
    if (!touchStartX.current) return;

    const touchEndX = e.touches[0].clientX;
    const diff = touchEndX - touchStartX.current;

    // If swiping right from left edge (to show sidebar)
    if (diff > 50 && touchStartX.current < 50) {
    setShowSidebar(true);
    }
    // If swiping left (to hide sidebar)
    else if (diff < -50) {
    setShowSidebar(false);
    }
};

const handleTouchEnd = () => {
    touchStartX.current = null;
};

// Handle chat selection
const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setShowSidebar(false);
};

// Initialize socket connection

useEffect(() => {
    if (!user?._id) return;

    const newSocket = io(SOCKET_URL, {
        query: { userId: user._id }
    });

    newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
    });

    newSocket.on("newChat", (chat) => {
        setChats(prevChats => {
            const chatExists = prevChats.some(existingChat => existingChat._id === chat._id);
            if (!chatExists) {
                return [...prevChats, chat];
            }
            return prevChats;
        });
    });

    newSocket.on("newMessage", (message) => {
        // Only add message if it's from another user and matches the selected chat
        if (message.sender !== user._id) {
            // Update messages only if we're in the relevant chat
            if (selectedChat && message.chat === selectedChat._id) {
                setMessages(prev => {
                    // Check if message already exists to prevent duplicates
                    const messageExists = prev.some(m => m._id === message._id);
                    if (!messageExists) {
                        return [...prev, message];
                    }
                    return prev;
                });
            }
            
            // Update chat list with latest message
            updateChatWithLatestMessage(message);
        }
    });

    setSocket(newSocket);

    return () => newSocket.close();
}, [user?._id, selectedChat]); // Add selectedChat as dependency

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

// Fetch all users
const fetchUsers = async () => {
    try {
    const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/all`,{ withCredentials: true });
    setUsers(data.data || []);
    } catch (error) {
    console.error("Error fetching users:", error);
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

// Send a message
const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
        const receiverId = selectedChat.users[0]._id;
        
        // Create new message object with a unique ID
        const tempId = Date.now().toString();
        const newMessageObj = {
            _id: tempId,
            text: newMessage,
            sender: user._id,
            chat: selectedChat._id,
            createdAt: new Date().toISOString()
        };

        // Optimistically update UI
        setMessages(prev => [...prev, newMessageObj]);
        setNewMessage('');

        // Send to server
        const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/chats`, {
            text: newMessage,
            recieverId: receiverId
        },{ withCredentials: true });

        // Update the temporary message with the real one
        setMessages(prev => 
            prev.map(msg => 
                msg._id === tempId ? { ...data, chat: selectedChat._id } : msg
            )
        );

        // Update chat list
        updateChatWithLatestMessage({
            chat: selectedChat._id,
            text: newMessage,
            sender: user._id
        });

        // Emit to socket
        if (socket) {
            socket.emit('newMessage', {
                receiverId,
                message: {
                    ...data,
                    chat: selectedChat._id
                }
            });
        }
    } catch (error) {
        console.error("Error sending message:", error);
        // Remove failed message from UI
        setMessages(prev => prev.filter(msg => msg._id !== tempId));
    }
};
// Initial data fetch
useEffect(() => {
    fetchChats();
    fetchUsers();
}, []);

// Fetch messages when chat is selected
useEffect(() => {
    if (selectedChat) {
    fetchMessages(selectedChat.users[0]._id);
    }
}, [selectedChat]);

// Auto-scroll to bottom when new messages arrive
useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

// Filter chats based on search query
const filteredChats = chats.filter(chat => 
    chat.users[0].name.toLowerCase().includes(searchQuery.toLowerCase())
);


    return (
        <MainLayout>
    <div 
        className={`container mx-auto h-[500px] ${
        isDark ? "text-gray-100" : "text-gray-900"
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
    >
        <Card className={`h-[calc(500px-2rem)] overflow-hidden relative ${
        isDark ? "bg-dark border-gray-800" : "bg-white"
        }`}>
        {/* Sidebar */}
        <div className={`
            absolute w-full
            transition-transform duration-300 ease-in-out
            ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
            ${isDark ? 'bg-black' : 'bg-white'}
            z-10 h-full border-r ${isDark ? 'border-gray-800' : 'border-gray-200'}
        `}>
            <div className="p-4 space-y-4">
            <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isDark ? "text-gray-400" : "text-gray-500"
                } h-4 w-4`} />
                <Input
                className={`pl-10 w-full ${
                    isDark 
                    ? "bg-gray-800 border-gray-700 focus:border-gray-600 placeholder-gray-400 text-gray-100" 
                    : "bg-white border-gray-200"
                }`}
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <ScrollArea className="h-[calc(500px-8rem)]">
                {isLoading ? (
                <div className={`text-center py-4 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                }`}>Loading chats...</div>
                ) : (
                <div className="space-y-2">
                    {filteredChats.map((chat) => (
                    <div
                        key={chat._id}
                        onClick={() => handleChatSelect(chat)}
                        className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer 
                        ${isDark 
                            ? `hover:bg-gray-800 ${selectedChat?._id === chat._id ? 'bg-black' : ''}` 
                            : `hover:bg-gray-100 ${selectedChat?._id === chat._id ? 'bg-gray-100' : ''}`
                        }`}
                    >
                        <Avatar>
                        <AvatarImage src={chat.users[0].avatar} />
                        <AvatarFallback className={isDark ? "bg-gray-700" : ""}>
                            {chat.users[0].name[0].toUpperCase()}
                        </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                            <p className="font-medium truncate">
                            {chat.users[0].name}
                            </p>
                            {onlineUsers.includes(chat.users[0]._id) && (
                            <div className="h-2 w-2 bg-green-500 rounded-full" />
                            )}
                        </div>
                        {chat.latestMessage && (
                            <p className={`text-sm truncate ${
                            isDark ? "text-gray-400" : "text-gray-500"
                            }`}>
                            {chat.latestMessage.sender === user._id ? 'You: ' : ''}
                            {chat.latestMessage.text}
                            </p>
                        )}
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </ScrollArea>
            </div>
        </div>

        {/* Chat Area */}
        <div className="w-full h-full flex flex-col">
            {selectedChat ? (
            <>
                                {/* Chat Header */}
                                {/* <Link to={"/user/"+selectedChat?.users[0]?._id}> */}
                <div className={`flex items-center space-x-4 p-4 border-b ${
                isDark ? "border-gray-800" : "border-gray-200"
                }`}>
                <Button
                    variant={isDark ? "ghost" : "ghost"}
                    size="icon"
                    onClick={() => setShowSidebar(true)}
                    className={isDark ? "text-gray-100 hover:text-gray-300" : ""}
                >
                    <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Link to={"/user/"+selectedChat?.users[0]?._id}>
                <Avatar>
                    <AvatarImage src={selectedChat.users[0].avatar} />
                    <AvatarFallback className={isDark ? "bg-gray-700" : ""}>
                    {selectedChat.users[0].name[0].toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="font-semibold">{selectedChat.users[0].name}</h2>
                    {onlineUsers.includes(selectedChat.users[0]._id) && (
                    <p className="text-sm text-green-500">Online</p>
                    )}
                                        </div>
                                        </Link>
                </div>
                {/* </Link> */}
                {/* Messages Area */}
                <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full p-4">
                    {isLoading ? (
                    <div className={`text-center ${
                        isDark ? "text-gray-400" : "text-gray-500"
                    }`}>Loading messages...</div>
                    ) : (
                    <div className="space-y-4">
                        {messages.map((message) => (
                        <div
                            key={message._id}
                            className={`flex ${
                            message.sender === user._id ? 'justify-end' : 'justify-start'
                            }`}
                        >
                            <div
                            className={`max-w-[70%] px-4 py-2 rounded-lg ${
                                message.sender === user._id
                                ? 'bg-blue-500 text-white'
                                : isDark ? 'bg-gray-800 text-gray-100' : 'bg-gray-100'
                            }`}
                            >
                            {message.text}
                            </div>
                        </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    )}
                </ScrollArea>
                </div>

                {/* Message Input */}
                <div className={`flex items-center space-x-2 p-4 border-t ${
                isDark ? "border-gray-800" : "border-gray-200"
                }`}>
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className={isDark 
                    ? "bg-gray-800 border-gray-700 focus:border-gray-600 placeholder-gray-400 text-gray-100" 
                    : ""}
                    onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        handleSendMessage();
                    }
                    }}
                />
                <Button 
                    onClick={handleSendMessage} 
                    disabled={!newMessage.trim() || isLoading}
                    className={isDark ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                    <Send className="h-4 w-4" />
                </Button>
                </div>
            </>
            ) : (
            <div className={`flex-1 flex items-center justify-center ${
                isDark ? "text-gray-400" : "text-gray-500"
            }`}>
                Select a chat to start messaging
            </div>
            )}
        </div>
        </Card>
    </div>
    </MainLayout>
);
}

export default ChatPage;