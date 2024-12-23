import {  createContext, useContext,useEffect,useState } from "react"
import { Toaster } from "@/components/ui/toaster"
const UserContext = createContext();

import { useToast } from "@/hooks/use-toast"
import axios from "axios";
export const UserContextProvider = ({ children }) => {
    const { toast } = useToast()
    const [user, setUser] = useState([]);
    const [isAuth, setIsAuth] = useState(false);
    axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';
    const [loading, setLoading] = useState(true);
    async function registerUser(formdata, navigate,fetchPosts) {
        setLoading(true);
        try {
            const { data } = await axios.post("/api/v1/auth/signup",formdata);
            console.log(data);
            
            toast({
                title: "Congratulations!",
                description: "You are now signed up !"
  
            })    
            setIsAuth(true);
            setUser(data.data.newUser);
            navigate("/");
            setLoading(false);
            fetchPosts();
        } catch (error) {
            
            toast({
                title: "Register Error",
                description: error.response.data.message,
            })
            setLoading(false);
        }
    }
    async function loginUser(email, password, navigate,fetchPosts) {
        setLoading(true);
        try {
            const { data } = await axios.post("/api/v1/auth/login", { email, password });
            
            toast({
                title: "Congratulations!",
                description: "You have Logged in successfully"
  
            })
            console.log(data.data.existingUser);
            
            setIsAuth(true);
            setUser(data.data.existingUser);
            navigate("/");
            setLoading(false);
            fetchPosts();
        } catch (error) {
            
            toast({
                title: "Login Error",
                description: error.response.data.message,
            })
            setLoading(false);
        }
    }
    async function fetchUser() {
    try {
        const { data } = await axios.get("/api/v1/users/me");
        setUser(data.data);
        setIsAuth(true);
        setLoading(false);
        
    } catch (error) {
        console.log(error);
        
        setIsAuth(false);
        setLoading(false);
    }
    }
    async function logoutUser() { 
        try {
            const { data } = await axios.post("/api/v1/auth/logout");
            if (data.message) {
                    toast({
                        title: "Logged Out",
                        description: "You have been logged out!",
                    })
                setUser([]);
                setIsAuth(false);
                navigate("/login");

                }
        } catch (error) {
            toast({
                title: "Logout Error",
                description: error.response.data.message,
              })
        }
    }
    async function followUser(id, fetchUser, isFollowing) {
       
        try {
            if (isFollowing) {
                const { data } = await axios.post("/api/v1/users/unfollow/" + id);
                toast({
                    title: "😒",
                    description: "You unfollowed this Account !",
                })
            } else {
                const { data } = await axios.post("/api/v1/users/follow/" + id);
           
                toast({
                    title: "😏",
                    description: "You followed this Account!",
                })
            }
           fetchUser();
       } catch (error) {
        toast({
            title: "😒",
            description: error.response.data.message,
          })
       }
    }
    async function updateProfile(formData) {
        try {
            const { data } = await axios.put("/api/v1/users/update",formData);
            toast({
                title: "😎",
                description: "Profile updated!",
            })
            fetchUser();
        } catch (error) {
            toast({
                title: "😒",
                description: error.response.data.message,
              })
        }
        
    }
    useEffect(() => {
    fetchUser();
},[]);
    return (
        <UserContext.Provider value={{ loginUser,isAuth,setIsAuth,user,setUser,loading,logoutUser,registerUser,followUser,fetchUser,updateProfile}}>
            {children}
           
  <Toaster />



        </UserContext.Provider>
    )
}

export const UserData = () => useContext(UserContext);
