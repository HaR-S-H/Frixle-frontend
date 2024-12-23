import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaHome, FaSearch, FaBell, FaUser, FaPlus,FaFilm, FaVideo } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';

function BottomNavbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/search', icon: FaSearch, label: 'Search' },
    { path: '/posts/new', icon: FaPlus, label: 'Post' },
    { path: '/reels', icon: FaVideo, label: 'Reels' },
    { path: '/user/account', icon: FaUser, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 sm:flex sm:justify-center">
      <Card className="w-full  rounded-none  shadow-md">
        <div className="flex justify-between items-center px-2 py-3 sm:px-4 md:px-6">
          {navItems.map((item) => (
            <Link to={item.path} key={item.path} className="w-full">
              <Button 
                variant="ghost"
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 py-2
                  ${currentPath === item.path 
                    ? 'text-blue-500' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-500'}`}
              >
                {item.label === 'Post' ? (
                  <div className={`rounded-full p-1 mb-1 ${
                    currentPath === item.path ? 'bg-blue-500' : 'bg-blue-500'
                  } text-white`}>
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                  </div>
                ) : (
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mb-1" />
                )}
                <span className="text-xs sm:text-sm">{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default BottomNavbar;