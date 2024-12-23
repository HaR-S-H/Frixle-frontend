import React, { useEffect, useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Settings, Film, Grid, Edit3, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "@/context/UserContext";
import { postData } from '@/context/PostContext';
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
import MainLayout from '@/layout/MainLayout';
import { SkeletonCard } from '@/components/SkeletonCard';
import EditProfileDialog from '@/components/EditProfileDialog';
const Account = ({ user }) => {
  const { posts } = postData();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { logoutUser,updateProfile } = UserData();
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        if (!user || !user._id) {
          setLoading(true);
          return;
        }

        // Filter posts only when user and posts are available
        if (posts && posts.length > 0) {
          const userPosts = posts.filter((post) => post.user._id === user._id);
          setFilteredPosts(userPosts);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error initializing data:', error);
        setLoading(false);
      }
    };

    initializeData();
  }, [user, posts]); // Dependencies updated to include posts

  const logoutHandler = () => {
    logoutUser(navigate);
  };

  if (loading || !user) {
    return (
      <MainLayout>
        <SkeletonCard />
      </MainLayout>
    );
  }
  
  const handleUpdateAvatar = async (newAvatar) => {
  
  };
  return (
    <MainLayout>
      
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8">
          <Avatar className="w-32 h-32">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <h1 className="text-xl font-semibold">{user.name}</h1>
              
              <div className="flex gap-2">
              <EditProfileDialog user={user} onUpdateAvatar={updateProfile} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-red-600" onClick={logoutHandler}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex gap-6 mb-4">
              <div className="text-center">
                <span className="font-semibold">{filteredPosts.length}</span>
                <p className="text-sm text-gray-600">posts</p>
              </div>
              
              {/* Followers Drawer */}
              <Drawer>
                <DrawerTrigger asChild>
                  <div className="text-center cursor-pointer">
                    <span className="font-semibold">{user.followers?.length || 0}</span>
                    <p className="text-sm text-gray-600">followers</p>
                  </div>
                </DrawerTrigger>
                <DrawerContent className="h-[85vh]">
                  <DrawerHeader className="border-b">
                    <DrawerTitle className="text-xl font-bold text-center">Followers</DrawerTitle>
                    <DrawerDescription className="text-center">People who follow</DrawerDescription>
                  </DrawerHeader>
                  
                  <div className="p-4 overflow-y-auto">
                    {user.followers?.map((follower) => (
                      <Link key={follower._id} to={`/user/${follower._id}`}>
                        <DrawerClose asChild>
                          <div className="flex items-start justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors">
                            <div className="flex gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={follower.avatar} alt={follower.name} />
                                <AvatarFallback>{follower.name?.charAt(0)}</AvatarFallback>
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
                      <Button variant="outline" className="w-full">Close</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>

              {/* Following Drawer */}
              <Drawer>
                <DrawerTrigger asChild>
                  <div className="text-center cursor-pointer">
                    <span className="font-semibold">{user.followings?.length || 0}</span>
                    <p className="text-sm text-gray-600">following</p>
                  </div>
                </DrawerTrigger>
                <DrawerContent className="h-[85vh]">
                  <DrawerHeader className="border-b">
                    <DrawerTitle className="text-xl font-bold text-center">Following</DrawerTitle>
                    <DrawerDescription className="text-center">People being followed</DrawerDescription>
                  </DrawerHeader>
                  
                  <div className="p-4 overflow-y-auto">
                    {user.followings?.map((following) => (
                      <Link key={following._id} to={`/user/${following._id}`}>
                        <DrawerClose asChild>
                          <div className="flex items-start justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors">
                            <div className="flex gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={following.avatar} alt={following.name} />
                                <AvatarFallback>{following.name?.charAt(0)}</AvatarFallback>
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
                      <Button variant="outline" className="w-full">Close</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>

            <div>
              <h2 className="font-semibold">{user.name}</h2>
              <p className="text-sm whitespace-pre-line">{user.bio || "Hello! everyone"}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
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

          {/* Posts Grid */}
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
                        ❤️ {post.likes?.length || 0}
                      </span>
                      <span className="flex items-center">
                        💬 {post.comments?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Reels Grid */}
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
                        ❤️ {post.likes?.length || 0}
                      </span>
                      <span className="flex items-center">
                        💬 {post.comments?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Account;