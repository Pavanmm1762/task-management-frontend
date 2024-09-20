import React, { createContext, useContext, useState, useEffect } from 'react';

const StateContext = createContext();

const initialState = {
    chat: false,
    cart: false,
    userProfile: false,
    notification: false,
};

export const ContextProvider = ({ children }) => {
    const [screenSize, setScreenSize] = useState(window.innerWidth);
    const [currentColor, setCurrentColor] = useState(localStorage.getItem('colorMode') || '#03C9D7');
    const [currentMode, setCurrentMode] = useState(localStorage.getItem('themeMode') || 'light');
    const [themeSettings, setThemeSettings] = useState(false);
    const [activeMenu, setActiveMenu] = useState(true);
    const [sidebarMode, setSidebarMode] = useState('expanded');
    const [sidebarName, setSidebarName] = useState('Dashboard')
    const [isClicked, setIsClicked] = useState(initialState);

    useEffect(() => {
        const rootElement = document.documentElement;
        if (currentMode === 'dark') {
            rootElement.classList.add('dark');
        } else {
            rootElement.classList.remove('dark');
        }

        const handleResize = () => {
            setScreenSize(window.innerWidth); // Update screen size on window resize
        };

        window.addEventListener('resize', handleResize); // Add event listener

        return () => window.removeEventListener('resize', handleResize); // Clean up event listener on unmount

    }, [currentMode]);

    const setMode = (mode) => {
        setCurrentMode(mode);
        localStorage.setItem('themeMode', mode);

        const rootElement = document.documentElement;
        if (mode === 'dark') {
            rootElement.classList.add('dark');
        } else {
            rootElement.classList.remove('dark');
        }
    };

    const setColor = (color) => {
        setCurrentColor(color);
        localStorage.setItem('colorMode', color);
    };

    const handleClick = (clicked) => setIsClicked({ ...initialState, [clicked]: true });

    return (
        <StateContext.Provider
            value={{
                currentColor,
                currentMode,
                activeMenu,
                screenSize,
                sidebarName,
                sidebarMode,
                setScreenSize,
                setSidebarName,
                handleClick,
                isClicked,
                setIsClicked,
                setActiveMenu,
                setCurrentColor,
                setCurrentMode,
                setMode,
                setColor,
                setSidebarMode,
                themeSettings,
                setThemeSettings,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
