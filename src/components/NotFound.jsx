import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '@/layout/MainLayout';

// Sample content component to demonstrate the blur effect


const NotFoundPage = () => {
  return (
    <MainLayout>
      <div className="absolute inset-0 flex items-center justify-center p-4 z-50 bg-black/10 backdrop-blur-sm">
        <Card className="w-full max-w-lg shadow-lg bg-white/90 rounded-lg">
          <CardContent className="p-6 md:p-8">
            <div className="space-y-6">
              {/* Error Code */}
              <div className="relative">
                <h1 className="text-6xl md:text-8xl font-bold text-gray-200 text-center">
                  404
                </h1>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl md:text-2xl font-medium text-gray-800">
                    Page Not Found
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-center text-gray-600">
                The page you're looking for isn't here. Let’s help you get back to something useful!
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  variant="default" 
                  className="w-full sm:w-auto flex items-center gap-2"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft size={16} />
                  Go Back
                </Button>
            <Link to={"/"}>
                <Button 
                  variant="outline"
                  className="w-full sm:w-auto flex items-center gap-2"
                >
                  <Home size={16} />
                  Home Page
                                  </Button>
                                  </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </MainLayout>
  );
};

export default NotFoundPage;
