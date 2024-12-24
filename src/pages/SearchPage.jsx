import React, { useState, useMemo, useEffect } from 'react';
import { Search, Users } from 'lucide-react';
import { Input } from "@/components/ui/input";
import MainLayout from '@/layout/MainLayout';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTheme } from "@/context/ThemeContext";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  const isDark = theme === "dark";

  async function fetchUser() {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/all`,{ withCredentials: true });
      setUsers(data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return [];
    if (!users || !Array.isArray(users)) return [];
    
    return users.filter(user => {
      const searchTerm = searchQuery.toLowerCase();
      const userName = (user.name || '').toLowerCase();
      const userBio = (user.bio || '').toLowerCase();
      
      return userName.includes(searchTerm) || userBio.includes(searchTerm);
    });
  }, [searchQuery, users]);

  return (
    <MainLayout>
      <div className={`max-w-screen-lg mx-auto p-4 min-h-screen ${
        isDark ? "bg-dark text-gray-100" : "bg-white text-gray-900"
      }`}>
        {/* Search Input */}
        <div className="relative mb-6">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`} />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 h-12 w-full ${
              isDark 
                ? "bg-gray-800 border-gray-700 focus:border-gray-600 focus:ring-gray-600 placeholder-gray-400 text-gray-100" 
                : "bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-gray-300 text-gray-900"
            }`}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className={`text-center py-12 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}>
            Loading users...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12 text-red-500">
            {error}
          </div>
        )}

        {/* Users List with Animations */}
        <div className="space-y-4">
          {!isLoading && !error && filteredUsers.map((user, index) => (
            <Link to={"/user/"+user._id} key={user._id || index}>
              <div
                className={`flex items-center p-3 rounded-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom ${
                  isDark 
                    ? "hover:bg-gray-800" 
                    : "hover:bg-gray-50"
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  opacity: 0,
                  animation: 'fadeSlideIn 0.3s ease forwards',
                  animationDelay: `${index * 100}ms`
                }}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'User'}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isDark ? "bg-gray-700" : "bg-gray-200"
                  }`}>
                    <Users className={`h-6 w-6 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`} />
                  </div>
                )}
                <div className="ml-4 flex-1 overflow-hidden">
                  <h3 className={`font-medium truncate ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}>
                    {user.name || 'Unnamed User'}
                  </h3>
                  {user.bio && (
                    <div className="flex space-x-2 items-center">
                      <p className={`text-sm truncate ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}>
                        {user.bio}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}

          {/* Initial State */}
          {!isLoading && !error && !searchQuery && (
            <div className={`text-center py-12 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}>
              Start typing to search for users
            </div>
          )}

          {/* No Results State */}
          {!isLoading && !error && searchQuery && filteredUsers.length === 0 && (
            <div className={`text-center py-8 animate-in fade-in slide-in-from-bottom ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}>
              No users found matching "{searchQuery}"
            </div>
          )}
        </div>

        <style jsx global>{`
          @keyframes fadeSlideIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </MainLayout>
  );
};

export default SearchPage;