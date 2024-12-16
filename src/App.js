import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from "./Pages/adminPages/authAdmin/login";
import MemberLoginForm from "./Pages/memberPages/memberAuth/memberLogin";
import RegisterForm from "./Pages/adminPages/authAdmin/register";
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import "./App.css";
import { adminRoutes } from "./routes/adminRoutes";
import { memberRoutes } from "./routes/memberRoutes";
import { SkeletonTheme } from "react-loading-skeleton";
import { useStateContext } from './contexts/contextProvider';

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state
  const { currentMode, activeMenu, themeSettings, sidebarMode, setActiveMenu, screenSize, setRole, role } = useStateContext();

  useEffect(() => {
    // Check if the user is logged in (has a valid token)
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      setLoggedIn(true);
      setRole(role);
      //setActiveMenu(true);
    }
    setLoading(false);
  }, [setActiveMenu, setRole]);

  const handleLogin = () => {
    setLoggedIn(true);
    setActiveMenu(true);  // Activate the sidebar when logged in
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setRole(null); // Clear role in context
    localStorage.removeItem('role');
    setLoggedIn(false);
    setActiveMenu(false);  // Deactivate the sidebar when logged out
  };

  // Prevent rendering while checking the login status
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={currentMode === 'dark' ? 'dark' : ''}>
      <SkeletonTheme
        baseColor={currentMode === 'dark' ? '#2c2c2c' : '#e0e0e0'}
        highlightColor={currentMode === 'dark' ? '#444' : '#f5f5f5'}
      >
        <BrowserRouter>
          <div className={`flex relative dark:bg-main-dark-bg ${sidebarMode === 'collapsed' ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
            {/* Show Sidebar if the user is logged in */}
            {isLoggedIn && activeMenu && (
              <div className={`fixed mt-16 sidebar dark:bg-main-dark-bg bg-white  ${screenSize >= 1024 && activeMenu
                ? sidebarMode === 'collapsed'
                  ? 'w-16'
                  : 'w-64'
                : screenSize < 1024 && activeMenu
                  ? 'w-64'
                  : 'hidden'
                } transition-all ease-in-out duration-300`} style={{ zIndex: '1100' }}>
                <Sidebar />
              </div>
            )}
            <div className="bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2" >
              {/* Show Navbar if the user is logged in */}
              {isLoggedIn && (
                <div className="bg-main-bg dark:bg-main-dark-bg navbar shadow sticky top-0 z-999 w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none" style={{ zIndex: '1200' }}>
                  <Navbar onLogout={handleLogout} />
                </div>
              )}
              <div className={isLoggedIn && ` ${screenSize >= 1024 && activeMenu
                ? sidebarMode === 'collapsed'
                  ? 'ml-[66px]'
                  : 'ml-[258px]'
                :
                ''
                } transition-all ease-in-out duration-300`}>
                {themeSettings}
                < Routes >
                  {/* Default route to dashboard or login */}
                  < Route
                    path="/"
                    element={isLoggedIn ? <Navigate to="/task_management/dashboard" /> : <LoginForm onLogin={handleLogin} />}
                  />
                  {/* Login and register routes */}
                  <Route path="/admin/login" element={<LoginForm onLogin={handleLogin} />} />
                  <Route path="/member/login" element={<MemberLoginForm onLogin={handleLogin} />} />
                  <Route path="/register" element={<RegisterForm />} />

                  {/* Protected routes */}
                  {isLoggedIn ? (
                    role === 'admin' ? adminRoutes : memberRoutes
                  ) : (
                    <Route path="*" element={<Navigate to="/admin/login" />} /> // Redirect to login if not authenticated
                  )}
                </Routes>
              </div>
            </div>
          </div >
        </BrowserRouter>
      </SkeletonTheme>
    </div >
  );
};

export default App;
