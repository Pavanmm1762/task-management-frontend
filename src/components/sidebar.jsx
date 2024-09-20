import React, { useState, useEffect, useMemo } from 'react';
import { FaTh, FaUserAlt, FaTasks, FaLayerGroup, FaThList } from "react-icons/fa";
import { NavLink, useLocation } from 'react-router-dom';
import { useStateContext } from '../contexts/contextProvider';

const Sidebar = () => {
    const { currentColor, activeMenu, setActiveMenu, screenSize, sidebarMode, setSidebarName } = useStateContext();
    const [submenuOpen, setSubmenuOpen] = useState(null);
    const location = useLocation(); // Hook to get current location

    const handleToggleSubmenu = (event, path) => {
        event.preventDefault();
        setSubmenuOpen((prevPath) => (prevPath === path ? null : path));
    };

    const handleMenuClick = () => {
        if (screenSize < 1024) {
            setActiveMenu(false); // Close sidebar on small screens
        }
    };
    const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2';
    const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

    const menuItem = useMemo(() => [
        {
            path: "/task_management/dashboard",
            name: "Dashboard",
            icon: <FaTh />
        },
        {
            path: "/task_management/project-lists",
            name: "Projects",
            icon: <FaLayerGroup />
        },
        {
            path: "/task_management/tasks",
            name: "Task",
            icon: <FaTasks />
        },
        {
            path: "/task_management/report",
            name: "Report",
            icon: <FaThList />
        },
        {
            path: "/task_management/users-list",
            name: "Users",
            icon: <FaUserAlt />
        }
    ], []);


    // Update sidebar name based on current location
    useEffect(() => {
        const currentPath = location.pathname;
        const activeItem = menuItem.find(item => item.path === currentPath);

        if (activeItem) {
            setSidebarName(activeItem.name);
        }
    }, [location, setSidebarName, menuItem]);

    return (
        <div className={` h-screen md:overflow-hidden overflow-auto pb-10  
            ${screenSize >= 1024 && activeMenu
                ? sidebarMode === 'collapsed'
                    ? 'w-16'
                    : 'w-72'
                : screenSize < 1024 && activeMenu
                    ? 'w-64'
                    : 'hidden'
            } transition-all ease-in-out duration-300`}>
            {activeMenu && (
                <>
                    {/* <div className="flex justify-between items-center">

                        <button
                            type="button"
                            onClick={() => setActiveMenu(!activeMenu)}
                            style={{ color: currentColor }}
                            className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
                        >
                            <MdOutlineCancel />
                        </button>
                    </div> */}
                    <div className="mt-5">
                        {menuItem.map((item, index) => (
                            <div key={item.name}>
                                <NavLink
                                    to={item.path}
                                    key={item.name}
                                    onMouseOver={(event) => handleToggleSubmenu(event, item.path)}
                                    onClick={!item.submenu && handleMenuClick}
                                    style={({ isActive }) => ({
                                        backgroundColor: isActive ? currentColor : '',
                                    })}
                                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                                >
                                    {item.icon}
                                    {sidebarMode === 'expanded' && <span className="capitalize">{item.name}</span>}

                                </NavLink>
                                {
                                    item.submenu && submenuOpen === item.path && (
                                        <div className="ml-8">
                                            {item.submenu.map((subitem, subindex) => (
                                                <NavLink
                                                    to={subitem.path}
                                                    key={subindex}
                                                    onClick={handleMenuClick}
                                                    style={({ isActive }) => ({
                                                        backgroundColor: isActive ? currentColor : '',
                                                    })}
                                                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                                                >
                                                    {sidebarMode === 'expanded' && <span className="capitalize">{subitem.name}</span>}
                                                </NavLink>
                                            ))}
                                        </div>
                                    )
                                }
                            </div>
                        ))}
                    </div>
                </>
            )
            }
        </div >
    );
};

export default Sidebar;
