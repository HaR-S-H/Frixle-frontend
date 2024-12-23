import { useEffect, useState } from 'react'
import {BrowserRouter,Route,Routes} from "react-router-dom"
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import { UserData } from './context/UserContext'
import Account from './pages/Account'
import BottomNavbar from './components/BottomNavbar'
import NotFound from './components/NotFound'
import Reels from './pages/Reels'
import AddPost from './components/AddPost'
import { SkeletonCard } from './components/SkeletonCard'
import UserAccount from './pages/UserAccount'
import SearchPage from './pages/SearchPage'
import ChatPage from './pages/ChatPage'
import MessageWindowRoute from './components/MessageWindowRoute'
import { ThemeProvider } from "./context/ThemeContext"
import TopNavbar from './components/TopNavbar'
function App() {
  const { user,isAuth,loading } = UserData();
  return (
    <>
       <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {loading ? <SkeletonCard/>: <BrowserRouter>
        <Routes>
          <Route path="/" element={isAuth ? <Home /> : <Login />} />
          <Route path="/user/account" element={isAuth ? <Account user={user}/> : <Login />} />
          <Route path="/login" element={!isAuth ? <Login /> : <Home />} />
          <Route path="/posts/new" element={!isAuth ? <Login /> : <AddPost />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/reels" element={isAuth ? <Reels /> : <Login />}  />
          <Route path="/user/:id" element={isAuth ? <UserAccount /> : <Login />}  />
          <Route path="/search" element={isAuth ? <SearchPage/>: <Login />}  />
          <Route path="/chats" element={isAuth ? <ChatPage/>: <Login />}  />
          <Route path="/chats/:id" element={isAuth ? <MessageWindowRoute /> : <Login />} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
          {isAuth && <BottomNavbar />}
        </BrowserRouter>}
        {/* { <TopNavbar />} */}
        </ThemeProvider>
      </>
   
  )
}

export default App;
