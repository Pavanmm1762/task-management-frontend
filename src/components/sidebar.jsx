import React, { useState } from 'react';
import {
    FaTh,
    FaBars,
    FaUserAlt,
    FaSignOutAlt,
    FaTasks,
    FaLayerGroup,
    FaThList
} from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
//import "./sidebar.css";
import { useStateContext } from '../contexts/contextProvider';
import { MdOutlineCancel } from 'react-icons/md';

const Sidebar = (onLogin) => {
    const { currentColor, activeMenu, setActiveMenu, screenSize } = useStateContext();
    const [submenuOpen, setSubmenuOpen] = useState(null);

    const handleCloseSideBar = () => {
        if (activeMenu !== undefined && screenSize <= 900) {
            setActiveMenu(false);
        }
    };

    const handleToggleSubmenu = (index) => {
        setSubmenuOpen(submenuOpen === index ? null : index);
    };

    const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-white  text-md m-2';
    const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

    const menuItem = [
        {
            path: "/task_management/dashboard",
            name: "Dashboard",
            icon: <FaTh />
        },
        {
            path: "/task_management/project",
            name: "Project",
            icon: <FaLayerGroup />,
            submenu: [

                {
                    path: "/task_management/create-project",
                    name: "Create Project",

                },
                {
                    path: "/task_management/project-lists",
                    name: "All Projects",

                },
                // Add more submenu items as needed
            ]
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
            path: "/task_management/users",
            name: "Users",
            icon: <FaUserAlt />,
            submenu: [
                {
                    path: "/task_management/add-user",
                    name: "Add user",

                },
                {
                    path: "/task_management/users-list",
                    name: "Users List",

                }
                // Add more submenu items as needed
            ]
        },
        {
            path: "/login",
            name: "Log-out",
            icon: <FaSignOutAlt />
        }
    ];

    return (
        <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
            {activeMenu && (
                <>
                    <div className="flex justify-between items-center">
                        <Link to="/" onClick={handleCloseSideBar} className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900">
                            <FaTasks /> <span>Task Management</span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => setActiveMenu(!activeMenu)}
                            style={{
                                color: currentColor,
                            }}
                            className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
                        >
                            <MdOutlineCancel />
                        </button>
                    </div>
                    <div className="mt-10">
                        {menuItem.map((item, index) => (
                            <div key={item.name}>
                                <NavLink
                                    to={item.path}
                                    key={item.name}
                                    onMouseOver={() => handleToggleSubmenu(index)}
                                    style={({ isActive }) => ({
                                        backgroundColor: isActive ? currentColor : '',
                                    })}
                                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                                >
                                    {item.icon}
                                    <span className="capitalize">{item.name}</span>
                                </NavLink>
                                {item.submenu && submenuOpen === index && (
                                    <div className="ml-8">
                                        {item.submenu.map((subitem, subindex) => (
                                            <NavLink
                                                to={subitem.path}
                                                key={subindex}
                                                style={({ isActive }) => ({
                                                    backgroundColor: isActive ? currentColor : '',
                                                })}
                                                className={({ isActive }) => (isActive ? activeLink : normalLink)}
                                            >
                                                <span className="capitalize">{subitem.name}</span>
                                            </NavLink>
                                        ))}
                                    </div>
                                )}

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
