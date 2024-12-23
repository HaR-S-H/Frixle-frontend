import React from 'react'

function ChatArea(selectedChat, messages = [], typingUsers = {}) {
    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

  return (
     <>
                 {/* Chat Header */}
                 <div className="flex items-center space-x-4 p-4 border-b">
                   <Avatar>
                     <AvatarImage src={selectedChat.users[0].avatar} />
                     <AvatarFallback>
                       {selectedChat.users[0].name[0].toUpperCase()}
                     </AvatarFallback>
                   </Avatar>
                   <div>
                     <h2 className="font-semibold">{selectedChat.users[0].name}</h2>
                     {onlineUsers.includes(selectedChat.users[0]._id) && (
                       <p className="text-sm text-green-500">Online</p>
                     )}
                   </div>
                 </div>
   
                 {/* Messages Area */}
                 <div className="flex-1 overflow-hidden">
                   <ScrollArea className="h-full p-4">
                     {isLoading ? (
                       <div className="text-center">Loading messages...</div>
                     ) : (
                       <div className="space-y-4">
                         {messages?.map((message) => (
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
                                   : 'bg-gray-100'
                               }`}
                             >
                               {message.text}
                             </div>
                           </div>
                         ))}
                         {/* {typingUsers[selectedChat?._id] && (
                           <div className="flex justify-start">
                             <TypingIndicator />
                             {console.log("Rendering typing indicator for chat:", selectedChat._id)}
                           </div>
                         )} */}
                         {/* <div ref={messagesEndRef} /> */}
                       </div>
                     )}
                   </ScrollArea>
                 </div>
   
                 {/* Message Input */}
                 <div className="flex items-center space-x-2 p-4 border-t">
                   <Input
                     value={newMessage}
                     onChange={(e) => {
                       setNewMessage(e.target.value);
                       handleTyping();
                     }}
                     placeholder="Type a message..."
                     onKeyPress={(e) => {
                       if (e.key === 'Enter') {
                         handleSendMessage();
                       }
                     }}
                   />
                   <Button 
                     onClick={handleSendMessage} 
                     disabled={!newMessage.trim() || isLoading}
                   >
                     <Send className="h-4 w-4" />
                   </Button>
                 </div>
               </>
  )
}

export default ChatArea
