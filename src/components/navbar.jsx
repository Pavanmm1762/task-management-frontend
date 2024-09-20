import React, { useEffect, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { useStateContext } from '../contexts/contextProvider';
import Chat from '../components/dropDownMessages';
import DropdownNotification from './dropDownNotification';
import DropdownUser from './dropDownUser';

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
    <button
        type="button"
        onClick={() => customFunc()}
        style={{ color }}
        className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
        <span
            style={{ background: dotColor }}
            className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
        />
        {icon}
    </button>
);

const Navbar = () => {
    const { currentColor, setActiveMenu, sidebarName, screenSize, currentMode, setMode, setSidebarMode } = useStateContext();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        if (screenSize <= 900) {
            setActiveMenu(false);
        } else {
            setActiveMenu(true);
        }
    }, [setActiveMenu, screenSize]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleMode = () => {
        setMode(currentMode === 'dark' ? 'light' : 'dark');
    };

    //  const handleActiveMenu = () => setActiveMenu(!activeMenu);
    const toggleSidebar = () => {
        if (screenSize <= 950) {
            // On small screens, show/hide the sidebar completely
            setSidebarMode('expanded');
            setActiveMenu(prev => !prev);
        } else {
            // On large screens, toggle between expanded and collapsed
            setSidebarMode(prev => (prev === 'expanded' ? 'collapsed' : 'expanded'));
        }
    };
    return (
        <div className={`flex justify-between p-2 sticky top-0 ${isScrolled ? 'shadow-md' : ''}`}>
            <div className="flex">
                <NavButton title="Menu" customFunc={toggleSidebar} color={currentColor} icon={<AiOutlineMenu />} />
                <h2 className="relative p-3 text-xl text-cyan-600 dark:text-cyan-400">
                    {sidebarName}
                </h2>
            </div>
            <div className="flex">
                <button type="button" onClick={() => toggleMode()} className="relative text-xl rounded-full p-3 hover:bg-light-gray dark:hidden block hs-dark-mode group flex items-center text-cyan-600 hover:text-blue-600 font-medium dark:text-gray-400 dark:hover:text-gray-500">
                    <svg className="flex-shrink-0 w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
                </button>
                <button type="button" onClick={() => toggleMode()} className="relative text-xl rounded-full p-3 hover:bg-light-gray dark:block hidden hs-dark-mode group flex items-center text-cyan-600 hover:text-cyan-600 font-medium dark:text-cyan-400 dark:hover:text-gray-500" data-hs-theme-click-value="light">
                    <svg className="flex-shrink-0 w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 8a2 2 0 1 0 4 4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
                </button>

                <Chat />
                <DropdownNotification />
                <DropdownUser />
            </div>
        </div>
    );
};

export default Navbar;
