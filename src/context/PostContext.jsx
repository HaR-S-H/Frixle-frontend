import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast";
const PostContext = createContext();


export const PostContextProvider = ({ children }) => {
    const { toast } = useToast()
    const [posts, setPosts] = useState([]);
    const [loading,setLoading] = useState(true);
    async function fetchPosts() {
        try {
            const { data } = await axios.get("/api/v1/posts/all");
            
            setPosts(data.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            
        }
    }
    async function addPost(formdata) {
        try {
            const { data } = await axios.post("/api/v1/posts/new", formdata);
            toast({
                title: "Hurray!",
                description: "Post  Added  Successfully 👌"
  
            }) 
        } catch (error) {
            
            toast({
                title: "Post Not Added 😭",
                description: error.response.data.message
  
            })    
        }
    }
    async function likePost(id) {
        try {
            const { data } = await axios.post("/api/v1/posts/like/" + id);
            
            toast({
                title: "💓",
                description: data.message
            })
            fetchPosts();
        } catch (error) {
            
             
        }
    }
    async function addComment(id,text,setComment) { 
        try {
            const { data } = await axios.post("/api/v1/posts/comment/" + id,{text});
            // console.log(data);
            
            toast({
                title: "Comment Added ! 😊",
                description: data.message
            })
            fetchPosts();
            setComment("");
        } catch (error) {
            console.log(error);
            
            toast({
                title: "Comment Not added 😕",
                description: error.response.data.message
  
            })  
        }
    }
    async function deletePost(id) {
        setLoading(true);
        try {
            const { data } = await axios.delete("/api/v1/posts/" + id);
            toast({
                title: "👍",
                description: "POST deleted!"
            })
            fetchPosts();
            setLoading(false);
        } catch (error) {
            toast({
                title: "👎",
                description: error.response.data.message
            })
            setLoading(false);
        }
    }
    async function updatePost(id,formData) {
        try {
            console.log(formData.media);
            
            const { data } = await axios.put("/api/v1/posts/" + id,formData);
            toast({
                title: "👍",
                description: "Post updated!"
            })
        } catch (error) {
            toast({
                title: "👎",
                description: error.response.data.message
            })
        }
    }
    async function deleteComment(id) {
        try {
            const { data } = await axios.delete("/api/v1/posts/comment/" + id);
            toast({
                title: "🤐",
                description: "Comment deleted!"
            })
            fetchPosts();
        } catch (error) {
            toast({
                title: "😭",
                description: error.response.data.message
            })
        
        }
    }
    async function editComment(id,text) {
        try {
            const { data } = await axios.put("/api/v1/posts/comment/" + id, { text });
            toast({
                title: "😏",
                description: "Comment edited!"
            })
            fetchPosts();
        } catch (error) {
            toast({
                title: "😭",
                description: error.response.data.message
            })
        
        }
    }
    useEffect(() => {
        fetchPosts();
    }, [posts]);
    return <PostContext.Provider value={{ posts,addPost,likePost,addComment,loading,fetchPosts,deletePost,updatePost,deleteComment,editComment }}>
        {children}
          <Toaster />
    </PostContext.Provider>
    
}

export const postData = () => useContext(PostContext);