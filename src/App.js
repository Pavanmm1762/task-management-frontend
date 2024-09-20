import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from "./Pages/Login/login";
import RegisterForm from "./Pages/Register/register";
import Dashboard from "./Pages/dashboard";
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import ProjectList from "./Pages/Project/projectList";
import ProjectDetails from './Pages/Project/projectDetails';
import CreateProject from "./Pages/Project/newProject";
import Tasks from "./Pages/task";
import Report from "./Pages/reportDetails";
import UsersList from "./Pages/Users/usersList";
import AddUser from "./Pages/Users/addUser";
import About from "./Pages/about";
import Chat from "./Pages/chat";
import "./App.css";
import { useStateContext } from './contexts/contextProvider';

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state
  const { currentMode, activeMenu, themeSettings, sidebarMode, setActiveMenu, screenSize } = useStateContext();

  useEffect(() => {
    // Check if the user is logged in (has a valid token)
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
      setActiveMenu(true);  // Activate menu if logged in
    }
    setLoading(false); // Stop loading once token is checked
  }, [setActiveMenu]);

  const handleLogin = () => {
    setLoggedIn(true);
    setActiveMenu(true);  // Activate the sidebar when logged in
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    setActiveMenu(false);  // Deactivate the sidebar when logged out
  };

  // Prevent rendering while checking the login status
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={currentMode === 'dark' ? 'dark' : ''}>
      <BrowserRouter>
        <div className={`flex relative dark:bg-main-dark-bg ${sidebarMode === 'collapsed' ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
          {/* Show Sidebar if the user is logged in */}
          {isLoggedIn && activeMenu && (
            <div className={`fixed mt-16 sidebar dark:bg-main-dark-bg bg-white  ${screenSize >= 1024 && activeMenu
              ? sidebarMode === 'collapsed'
                ? 'w-16'
                : 'w-72'
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
                ? 'ml-16'
                : 'ml-72'
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
                <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
                <Route path="/register" element={<RegisterForm />} />

                {/* Protected routes */}
                {isLoggedIn ? (
                  <>
                    <Route path="/task_management/dashboard" element={<Dashboard />} />
                    <Route path="/task_management/project-lists" element={<ProjectList />} />
                    <Route path="/project/:projectId" element={<ProjectDetails />} />
                    <Route path="/task_management/create-project" element={<CreateProject />} />
                    <Route path="/task_management/tasks" element={<Tasks />} />
                    <Route path="/task_management/report" element={<Report />} />
                    <Route path="/task_management/users-list" element={<UsersList />} />
                    <Route path="/task_management/add-user" element={<AddUser />} />
                    <Route path="/task_management/about" element={<About />} />
                    <Route path="/task_management/messages" element={<Chat />} />
                  </>
                ) : (
                  <Route path="*" element={<Navigate to="/login" />} /> // Redirect to login if not authenticated
                )}
              </Routes>
            </div>
          </div>
        </div >
      </BrowserRouter >
    </div >
  );
};

export default App;
