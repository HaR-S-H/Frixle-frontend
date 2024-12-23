import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserContextProvider } from './context/UserContext'
import { ChatProvider } from './context/ChatContext'
import { PostContextProvider } from './context/PostContext'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <PostContextProvider>
        <ChatProvider>
          <App />
          </ChatProvider>
        </PostContextProvider>
    </UserContextProvider>
    
  </StrictMode>,
)
