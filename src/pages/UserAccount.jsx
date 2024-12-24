import React, { useEffect, useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import MessageWindow from '@/components/MessageWindow';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Settings, Film, Grid, Edit3,UserPlus } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserData } from "@/context/UserContext";
import { postData } from '@/context/PostContext';
import axios from 'axios';
import { SkeletonCard } from '@/components/SkeletonCard';
import MainLayout from '@/layout/MainLayout';

const UserAccount = () => {
   
    const { posts } = postData();
    const [showMessageWindow, setShowMessageWindow] = useState(false);
    const params = useParams();
    const  navigate  = useNavigate();
    const { user,followUser } = UserData();
    const [isFollowing, setIsFollowing] = useState(false);
    const [otherUser, setUser] = useState([]);
    const [loading,setLoading] = useState(true);
    const filteredPosts = posts.filter((post) => post.user._id === otherUser._id);

    async function fetchUser() {
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/${params.id}`,
                {}, // request body
                { withCredentials: true } // config object
              );
            setUser(data.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (params.id === user._id) {
            navigate("/user/account");
            return;
        }
        else {
            fetchUser();
        }
    }, [params.id]);

    const handleFollow = () => {
        setIsFollowing(!isFollowing);
        followUser(otherUser._id,fetchUser,isFollowing);
    };

    const handleNewChatCreated = (chatData) => {
        setChats(prev => {
            const chatExists = prev.some(chat => chat._id === chatData._id);
            if (!chatExists) {
                return [...prev, chatData];
            }
            return prev;
        });
    };
    
    
    useEffect(() => {
        if (otherUser?.followers && user?._id) {
            const isUserFollowing = otherUser.followers.some(
                follower => follower._id === user._id
            );
            setIsFollowing(isUserFollowing);
        }
    }, [otherUser.followers, user._id]);

    return (
        <MainLayout>
            <>
            {loading ? <SkeletonCard /> :
                <>
                    {otherUser && (
                        <div className="max-w-4xl mx-auto px-4 py-8">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8">
                                <Avatar className="w-32 h-32">
                                    <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                                    <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                                </Avatar>

                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-4 flex-wrap">
                                        <h1 className="text-xl font-semibold">{otherUser.name}</h1>
                                        <div className="flex gap-4">
                                            <Button
                                                variant={isFollowing ? "outline" : "default"}
                                                onClick={handleFollow}
                                                className="w-28"
                                            >
                                                {isFollowing ? "Following" : "Follow"}
                                            </Button>
                                            <Button 
                                                variant="outline"
                                                onClick={() => setShowMessageWindow(true)}
                                                className="w-28 bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                                            >
                                                Message
                                            </Button>
                                        </div>
                                        <MessageWindow
                                            recipientUser={otherUser}
                                            isOpen={showMessageWindow}
                                            onClose={() => setShowMessageWindow(false)}
                                            onChatCreated={handleNewChatCreated}
                                        />
                                    </div>

                                    <div className="flex gap-6 mb-4">
                                        <div className="text-center">
                                            <span className="font-semibold">{filteredPosts.length}</span>
                                            <p className="text-sm text-gray-600">posts</p>
                                        </div>
                                        <Drawer>
                                            <DrawerTrigger asChild>
                                                <div className="text-center">
                                                    <span className="font-semibold cursor-pointer">{otherUser.followers.length}</span>
                                                    <p className="text-sm text-gray-600 cursor-pointer">followers</p>
                                                </div>
                                            </DrawerTrigger>
                                            <DrawerContent className="h-[85vh]">
                                                <DrawerHeader className="border-b">
                                                    <DrawerTitle className="text-xl font-bold text-center">Followers</DrawerTitle>
                                                    <DrawerDescription className="text-center">People who follow</DrawerDescription>
                                                </DrawerHeader>
                                                
                                                <div className="p-4 overflow-y-auto">
                                                    {otherUser.followers.map((follower) => (
                                                        <Link to={"/user/" + follower._id} key={follower._id}>
                                                            <DrawerClose asChild>
                                                                <div className="flex items-start justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors">
                                                                    <div className="flex gap-3">
                                                                        <Avatar className="h-12 w-12">
                                                                            <AvatarImage src={follower.avatar} alt={follower.name} />
                                                                            <AvatarFallback>{follower.name.charAt(0)}</AvatarFallback>
                                                                        </Avatar>
                                                                        <div>
                                                                            <h3 className="font-semibold text-sm">{follower.name}</h3>
                                                                            <p className="text-sm text-gray-600 mt-1">{follower.bio}</p>
                                                                        </div>
                                                                    </div>
                                                                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                                                                        <UserPlus className="h-4 w-4" />
                                                                        Follow
                                                                    </Button>
                                                                </div>
                                                            </DrawerClose>
                                                        </Link>
                                                    ))}
                                                </div>

                                                <DrawerFooter className="border-t">
                                                    <DrawerClose asChild>
                                                        <Button variant="outline" className="w-full">
                                                            Close
                                                        </Button>
                                                    </DrawerClose>
                                                </DrawerFooter>
                                            </DrawerContent>
                                        </Drawer>
                                        <Drawer>
                                            <DrawerTrigger asChild>
                                                <div className="text-center">
                                                    <span className="font-semibold cursor-pointer">{otherUser.followings.length}</span>
                                                    <p className="text-sm text-gray-600 cursor-pointer">following</p>
                                                </div>
                                            </DrawerTrigger>
                                            <DrawerContent className="h-[85vh]">
                                                <DrawerHeader className="border-b">
                                                    <DrawerTitle className="text-xl font-bold text-center">Followings</DrawerTitle>
                                                    <DrawerDescription className="text-center">People who following</DrawerDescription>
                                                </DrawerHeader>
                                                
                                                <div className="p-4 overflow-y-auto">
                                                    {otherUser.followings.map((following) => (
                                                        <Link to={"/user/"+following._id} key={following._id}>
                                                            <DrawerClose asChild>
                                                                <div className="flex items-start justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors">
                                                                    <div className="flex gap-3">
                                                                        <Avatar className="h-12 w-12">
                                                                            <AvatarImage src={following.avatar} alt={following.name} />
                                                                            <AvatarFallback>{following.name.charAt(0)}</AvatarFallback>
                                                                        </Avatar>
                                                                        <div>
                                                                            <h3 className="font-semibold text-sm">{following.name}</h3>
                                                                            <p className="text-sm text-gray-600 mt-1">{following.bio}</p>
                                                                        </div>
                                                                    </div>
                                                                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                                                                        <UserPlus className="h-4 w-4" />
                                                                        Follow
                                                                    </Button>
                                                                </div>
                                                            </DrawerClose>
                                                        </Link>
                                                    ))}
                                                </div>

                                                <DrawerFooter className="border-t">
                                                    <DrawerClose asChild>
                                                        <Button variant="outline" className="w-full">
                                                            Close
                                                        </Button>
                                                    </DrawerClose>
                                                </DrawerFooter>
                                            </DrawerContent>
                                        </Drawer>
                                    </div>

                                    <div>
                                        <h2 className="font-semibold">{otherUser.name}</h2>
                                        <p className="text-sm whitespace-pre-line">{otherUser.bio || "Hello! everyone"}</p>
                                    </div>
                                </div>
                            </div>

                            <Tabs defaultValue="posts" className="w-full">
                                <TabsList className="w-full">
                                    <TabsTrigger value="posts" className="flex-1">
                                        <Grid className="h-4 w-4 mr-2" />
                                        POSTS
                                    </TabsTrigger>
                                    <TabsTrigger value="reels" className="flex-1">
                                        <Film className="h-4 w-4 mr-2" />
                                        REELS
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="posts">
                                    <div className="grid grid-cols-3 gap-1">
                                        {filteredPosts.map((post) => (
                                            <div
                                                key={post._id}
                                                className="aspect-square relative group overflow-hidden bg-gray-100"
                                            >
                                                <img
                                                    src={post.media}
                                                    alt=""
                                                    className="object-cover w-full h-full"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white">
                                                    <div className="flex items-center gap-4">
                                                        <span className="flex items-center">
                                                            ❤️ {post.likes.length}
                                                        </span>
                                                        <span className="flex items-center">
                                                            💬 {post.comments.length}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="reels">
                                    <div className="grid grid-cols-3 gap-1">
                                        {filteredPosts.map((post) => (
                                            <div
                                                key={post._id}
                                                className="aspect-square relative group overflow-hidden bg-gray-100"
                                            >
                                                <img
                                                    src={post.media}
                                                    alt=""
                                                    className="object-cover w-full h-full"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white">
                                                    <div className="flex items-center gap-4">
                                                        <span className="flex items-center">
                                                            ❤️ {post.likes.length}
                                                        </span>
                                                        <span className="flex items-center">
                                                            💬 {post.comments.length}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}
                </>
            }
            </>
        </MainLayout>
    );
};

export default UserAccount;