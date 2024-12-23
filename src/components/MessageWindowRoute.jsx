import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChat } from '@/context/ChatContext';
import MessageWindow from './MessageWindow';

const MessageWindowRoute = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { chats, setSelectedChat, fetchMessages, currentUser } = useChat();

  useEffect(() => {
    if (!currentUser?._id) {
      return navigate('/login'); // Redirect to login if no user
    }

    const chatFromId = chats.find(chat => chat._id === id);
    if (chatFromId) {
      setSelectedChat(chatFromId);
      fetchMessages(chatFromId.users[0]._id);
    } else {
      // If chat not found, redirect to main chat page
      navigate('/chats');
    }
  }, [id, chats, currentUser]);

  if (!currentUser?._id) {
    return null; // Don't render anything while redirecting
  }

  return <MessageWindow />;
};

export default MessageWindowRoute;