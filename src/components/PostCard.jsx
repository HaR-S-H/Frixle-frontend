import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, MessageCircle, Share2, Bookmark, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { UserData } from "@/context/UserContext";
import { postData } from "@/context/PostContext";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import EditPostDialog from "./EditPostDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditCommentDialog from "./EditCommentDialog";
import { useTheme } from "@/context/ThemeContext";
const PostCard = ({ value, user, isLastPost }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(value.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const { likePost, addComment, deletePost,fetchPosts,deleteComment,editComment } = postData();
  const { theme } = useTheme();
  useEffect(() => {
    setLikes(value.likes.length);
    setIsLiked(value.likes.includes(user._id));
  }, [value.likes, user._id]);
  // useEffect(() => {
  //   for (let i = 0; i < value.likes.length; i++) {
  //     if (value.likes[i] === user._id) {
  //       setIsLiked(true);
  //       break;
  //     }
  //   }
  // }, [value, user._id]);

  const formatTimeAgo = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const handleLike = async () => {
    try {
      // First update the UI optimistically
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikes(prev => newIsLiked ? prev + 1 : prev - 1);
      
      // Then make the API call
      await likePost(value._id);
    } catch (error) {
      // If the API call fails, revert the UI changes
      console.error('Like operation failed:', error);
      setIsLiked(!isLiked);
      setLikes(value.likes.length);
    }
  };
  const handleDeleteComment = (id) => {
    // Add your delete comment logic here
    deleteComment(id);
  };
  const handleEditComment = (id,text) => { 
    editComment(id, text);
  }
  const handleComment = (e) => {
    e.preventDefault();
    const text = comment;
    addComment(value._id, text, setComment);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };
  const deleteHandler = () => {
    deletePost(value._id);
  }

  // Calculate comment height - each comment is approximately 3.5rem (56px) high
  const COMMENT_HEIGHT = 56; // height in pixels for one comment
  const scrollAreaHeight = Math.min(value.comments.length, 2) * COMMENT_HEIGHT;

  return (
    <Card
    className={`${isLastPost ? "mb-32" : "mb-8"} w-full max-w-[500px] mx-auto sm:rounded-md sm:px-4 pb-5 ${
      theme === "dark" ? "bg-black text-white" : "bg-white text-black"
    } transition-colors`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
      <Link to={"/user/"+value.user._id}>
        <div className="flex items-center space-x-2">
        
          <Avatar className="h-7 w-7">
            <AvatarImage src={value.user.avatar} alt="User avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-xs">{value.user.name}</p>
            </div>
            
          </div>
          </Link>
        {value.user._id === user._id &&
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-full">
                <MoreVertical className="h-4 w-4 text-slate-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
            
              <EditPostDialog 
  post={value} 
  onEdit={() => {
    // Refresh posts or update UI
    fetchPosts();
  }} 
/>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer " onClick={deleteHandler}>
                <Trash2 className="h-4 w-4" />
                <span>Delete Post</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      </div>

      {/* Post Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={value.media[0]}
          alt="Post content"
          className="object-cover w-full h-full max-w-full"
        />
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-2">
        <div className="flex justify-between">
          <div className="flex space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLike}
              className={isLiked ? "text-red-500" : ""}
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleComments}>
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
          <Button variant="ghost" size="icon">
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Likes Count */}
      <div className="flex">
        <CardContent className="px-2 py-1">
          <p className="font-medium text-xs">{likes} likes</p>
        </CardContent>
        <CardContent className="px-4 py-1">
          <p className="font-medium text-xs">{value.comments.length} comments</p>
        </CardContent>
      </div>

      {/* Caption */}
      <CardContent className="px-4 py-1">
        <p className="text-xs">{value.text}</p>
      </CardContent>

      {/* Comments Section */}
      {showComments && (
        <CardContent className="px-4 py-2">
          <ScrollArea 
            className="mb-4" 
            style={{ height: value.comments.length > 2 ? scrollAreaHeight : 'auto' }}
          >
            <div className="space-y-2">
              {value.comments.map((comment, index) => (
                <div key={comment._id} className="flex space-x-2 mb-2">
                  <Link to={comment.user._id===user._id?"/user/account":`/user/${comment.user._id}`}>
                  <Avatar className="h-7 w-7 flex-shrink-0">
                    <AvatarImage src={comment.user.avatar} alt="User avatar" />
                    <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    </Link>
                  <div className="flex-1">
                    <p className="text-xs flex">
                      <span className="font-medium">{comment.user.name}</span>
                      <div className="ms-auto">
                       {(comment.user._id === user._id)? (
                       
                       <DropdownMenu>
                       <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-full">
                           <MoreVertical className="h-4 w-4 text-slate-600" />
                         </Button>
                       </DropdownMenuTrigger>
                       <DropdownMenuContent align="end" className="w-40">
                       <EditCommentDialog
  comment={comment} 
  onEdit={() => {
    // Refresh posts or update UI
    fetchPosts();
  }} 
/>
                         <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={()=>handleDeleteComment(comment._id)}>
                           <Trash2 className="h-4 w-4" />
                           <span>Delete Comment</span>
                         </DropdownMenuItem>
                       </DropdownMenuContent>
                     </DropdownMenu>
                         
                      ):value.user._id ===user._id?(
                       
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-full">
                            <MoreVertical className="h-4 w-4 text-slate-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={()=>handleDeleteComment(comment._id)}>
                            <Trash2 className="h-4 w-4" />
                            <span>Delete Comment</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                          
                       ):""} </div>
                    </p>
               <span className="text-xs">{comment.text}</span>
                   
                    {comment.updatedAt && (
                      <p className="text-[10px] text-gray-400">{formatTimeAgo(comment.updatedAt)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <form className="flex items-center space-x-2" onSubmit={handleComment}>
            <Link to={"/user/account"}>
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.avatar} alt="Your avatar" />
              <AvatarFallback>ME</AvatarFallback>
              </Avatar>
              </Link>
            <input
              type="text"
              placeholder="Add a comment..."
              className={theme === "dark"?"flex-1 bg-gray-100 text-xs px-3 py-1 rounded-md focus:outline-none text-black":`flex-1 bg-gray-100 text-xs px-3 py-1 rounded-md focus:outline-none`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button type="submit" size="sm">
              Post
            </Button>
          </form>
        </CardContent>
      )}

      <CardFooter className="px-4 py-1 flex flex-col items-start space-y-1">
        <div className="w-full">
          <p className="text-xs text-gray-500 cursor-pointer" onClick={toggleComments}>
            {showComments ? "Hide comments" : `View all ${value.comments.length} comments`}
          </p>
        </div>
        <div className="w-full text-[10px] text-gray-400">{formatTimeAgo(value.createdAt)}</div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;