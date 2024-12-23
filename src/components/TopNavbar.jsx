import React from "react";
import { MessageCircle, Heart } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { ModeToggle } from "./ModeToggle";
import { useTheme } from "@/context/ThemeContext"; // Import the theme hook

const Heading = styled.h1`
  font-family: "Mea Culpa", serif;
  font-weight: 500;
  font-style: normal;
  font-size: 40px;
  color: sky-blue;
`;

const TopNavbar = () => {
  const { theme, setTheme } = useTheme(); // Access theme and setTheme from context

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
    <nav
      className={`fixed h-8 w-full ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }  shadow-sm z-40 pl-10 p-10 transition-colors`}
    >
      <div className="h-full flex justify-between items-center px-4 sm:px-6 lg:px-8">
        {/* Instagram Text */}
        <Heading className="text-center">Frixle</Heading>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Heart className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer hover:text-gray-500 transition-colors" />
          <Link to={"/chats"}>
            <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer hover:text-gray-500 transition-colors" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
