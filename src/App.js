// App.js
import React, { useState, useEffect } from "react";
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from "./Pages/Login/login";
import RegisterForm from "./Pages/Register/register";
import Dashboard from "./Pages/dashboard";
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import ProjectList from "./Pages/Project/projectList";
import CreateProject from "./Pages/Project/newProject"
import Tasks from "./Pages/task";
import Report from "./Pages/reportDetails";
import UsersList from "./Pages/Users/usersList";
import AddUser from "./Pages/Users/addUser";
import About from "./Pages/about";
import { useStateContext } from './contexts/contextProvider';


const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const { setCurrentColor, setCurrentMode, currentMode, activeMenu, currentColor, themeSettings, setThemeSettings } = useStateContext();

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }

    // Check if the user is logged in
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    if (storedLoginStatus) {
      setLoggedIn(true);
    }
  }, []);


  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>

            <button
              type="button"
              onClick={() => setThemeSettings(true)}
              style={{ background: currentColor, borderRadius: '50%' }}
              className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
            >
            </button>

          </div>
          {isLoggedIn && ( // Add this condition
            <>
              {activeMenu ? (
                <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white z-1010" style={{ zIndex: '1100' }}>
                  <Sidebar />
                </div>
              ) : (
                <div className="w-0 dark:bg-secondary-dark-bg">
                  <Sidebar />
                </div>
              )}
            </>
          )}
          <div
            className={
              activeMenu
                ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  '
                : 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '
            }
          >
            {isLoggedIn && (
              <div className=" bg-main-bg dark:bg-main-dark-bg navbar shadow sticky top-0 z-999 w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none" style={{ zIndex: '1000' }}>
                <Navbar />
              </div>
            )}
            <div>
              {themeSettings}

              <Routes>
                {/* Redirect to the login page if not logged in */}
                {!isLoggedIn && (
                  <Route
                    path="*"
                    element={<Navigate to="/login" state={{ message: 'Please log in to access the page.' }} />}
                  />
                )}
                <Route
                  path="/"
                  element={
                    isLoggedIn ? <Dashboard /> : <LoginForm onLogin={() => setLoggedIn(true)} />
                  }
                />
                <Route path="/login" element={< LoginForm onLogin={() => setLoggedIn(true)} />} />

                <Route path="/register" element={<RegisterForm />} />
                <Route path="/task_management/dashboard" element={<Dashboard />} />
                <Route path="/task_management/project-lists" element={<ProjectList />} />
                <Route path="/task_management/create-project" element={<CreateProject />} />
                <Route path="/task_management/tasks" element={<Tasks />} />
                <Route path="/task_management/report" element={<Report />} />
                <Route path="/task_management/users-list" element={<UsersList />} />
                <Route path="/task_management/add-user" element={<AddUser />} />
                <Route path="/task_management/about" element={<About />} />


              </Routes>


            </div>

          </div>
        </div>
      </BrowserRouter >
    </div >
  );
};



export default App;
