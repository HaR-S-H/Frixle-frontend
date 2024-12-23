import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, X, ArrowLeft } from "lucide-react";
import axios from 'axios';
import { io } from 'socket.io-client';
import { UserData } from '@/context/UserContext';
import { useTheme } from "@/context/ThemeContext";

const SOCKET_URL = "https://frixle-backend.onrender.com";

const MessageWindow = ({ recipientUser, isOpen, onClose, onChatCreated }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const messagesEndRef = useRef(null);
  const cardRef = useRef(null);
  const { user } = UserData();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isRightSwipe) {
      onClose();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, onClose]);

  useEffect(() => {
    if (!user?._id) return;

    const newSocket = io(SOCKET_URL, {
      query: { userId: user._id }
    });

    newSocket.on("newMessage", (message) => {
      if (message.sender !== user._id && 
          (message.sender === recipientUser._id || message.receiver === recipientUser._id)) {
        setMessages(prev => [...prev, message]);
      }
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [user?._id, recipientUser._id]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/api/v1/chats/${recipientUser._id}`);
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && recipientUser?._id) {
      fetchMessages();
    }
  }, [isOpen, recipientUser?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const newMessageObj = {
        _id: Date.now(),
        text: newMessage,
        sender: user._id,
        receiver: recipientUser._id,
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, newMessageObj]);
      setNewMessage('');

      const { data } = await axios.post("/api/v1/chats", {
        text: newMessage,
        recieverId: recipientUser._id
      });

      // Create chat data
      const chatData = {
        _id: data.chat,
        users: [
          {
            _id: user._id,
            name: user.name,
            avatar: user.avatar
          }
        ],
        latestMessage: {
          text: newMessage,
          sender: user._id
        }
      };

      if (onChatCreated) {
        onChatCreated(chatData);
      }

      if (socket) {
        // Emit the new chat data
        socket.emit('newChat', {
          receiverId: recipientUser._id,
          chat: {
            _id: data.chat,
            users: [
              {
                _id: user._id,
                name: user.name,
                avatar: user.avatar
              }
            ],
            latestMessage: {
              text: newMessage,
              sender: user._id
            }
          }
        });

        // Emit the message
        socket.emit('newMessage', {
          receiverId: recipientUser._id,
          message: data
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => prev.filter(msg => msg._id !== Date.now()));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 pointer-events-none flex items-center justify-center pl-4 pr-4 pb-4">
      <Card 
        ref={cardRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={`w-full max-w-lg h-[70vh] shadow-lg flex flex-col pointer-events-auto ${
          isDark ? "bg-black border-gray-800 text-gray-100" : "bg-white"
        }`}
      >
        <div className={`flex items-center justify-between p-4 border-b ${
          isDark ? "border-gray-800" : "border-gray-200"
        }`}>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className={`${isDark ? "text-gray-400 hover:text-gray-300" : ""}`}
            >
              <X className="h-4 w-4 block sm:hidden" />
              <ArrowLeft className="h-4 w-4 hidden sm:block" />
            </Button>
            <Avatar>
              <AvatarImage src={recipientUser.avatar} />
              <AvatarFallback className={isDark ? "bg-gray-700" : ""}>
                {recipientUser.name[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold">{recipientUser.name}</h3>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
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

        <div className={`p-4 border-t ${
          isDark ? "border-gray-800" : "border-gray-200"
        }`}>
          <div className="flex space-x-2">
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
        </div>
      </Card>
    </div>
  );
};

export default MessageWindow;