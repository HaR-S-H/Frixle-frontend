import TopNavbar from '@/components/TopNavbar';
import React from 'react';
// import BottomNavbar from '@/components/BottomNavbar';
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full">
          {/* Main content container */}
        
              <TopNavbar />
              
          <main className="mx-auto w-full max-w-[500px] min-h-screen pl-6 pr-6 pt-24">
        
              {children}
              {/* <BottomNavbar/> */}
      </main>
    </div>
  );
};

export default MainLayout;