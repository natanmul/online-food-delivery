import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { USER_ROLES } from '../../utils/constants.js';

const Layout = ({ children }) => {
  const { user } = useAuth();

  const isDashboardLayout = user && [
    USER_ROLES.RESTAURANT,
    USER_ROLES.DRIVER,
    USER_ROLES.ADMIN
  ].includes(user.role);

  if (isDashboardLayout) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex">
          <aside className="hidden md:block">
            <div className="sticky top-0">
              {/* Sidebar will be conditionally rendered in dashboard pages */}
            </div>
          </aside>
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;