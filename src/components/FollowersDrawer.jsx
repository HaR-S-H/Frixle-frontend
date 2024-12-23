import React from 'react';
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, X } from "lucide-react";
import { Link } from 'react-router-dom';

const FollowersDrawer = () => {
  // Sample followers data - replace with your actual data
  const followers = [
    {
      id: 1,
      name: "Sarah Wilson",
      username: "@sarahw",
      avatar: "/api/placeholder/32/32",
      bio: "Digital artist & creative developer"
    },
    {
      id: 2,
      name: "James Rodriguez",
      username: "@jamesrod",
      avatar: "/api/placeholder/32/32",
      bio: "Photography enthusiast | Travel lover"
    },
    {
      id: 3,
      name: "Emma Thompson",
      username: "@emmathompson",
      avatar: "/api/placeholder/32/32",
      bio: "UX Designer | Coffee addict"
    },
    {
      id: 4,
      name: "Michael Chen",
      username: "@mikechen",
      avatar: "/api/placeholder/32/32",
      bio: "Tech entrepreneur | AI researcher"
    },
    {
      id: 5,
      name: "Lisa Parker",
      username: "@lisap",
      avatar: "/api/placeholder/32/32",
      bio: "Content creator | Lifestyle blogger"
    }
  ];

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <span className="font-semibold">2.5K</span> Followers
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh]">
        <DrawerHeader className="border-b">
          <DrawerTitle className="text-xl font-bold">Followers</DrawerTitle>
          <DrawerDescription>People who follow you</DrawerDescription>
        </DrawerHeader>
        
        <div className="p-4 overflow-y-auto">
                  {followers.map((follower) => (
                    
              <Link to={"/user/"+follower._id}>
            <div 
              key={follower.id} 
              className="flex items-start justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors"
            >
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
  );
};

export default FollowersDrawer;