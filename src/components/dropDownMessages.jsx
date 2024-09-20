import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import avatar from '../components/data/img_avatar2.png';
import { BsChatLeft } from 'react-icons/bs';


const DropdownMessage = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const trigger = useRef(null);
    const dropdown = useRef(null);

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!dropdown.current) return;
            if (
                !dropdownOpen ||
                dropdown.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setDropdownOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!dropdownOpen || keyCode !== 27) return;
            setDropdownOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    });



    return (
        <div className="relative">
            < button
                type="button"
                ref={trigger}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                    color: "#03C9D7"
                }}
                className="relative text-xl rounded-full p-4 hover:bg-light-gray"
            >
                <span
                    style={{ background: "#03C9D7" }}
                    className="absolute inline-flex rounded-full h-2 w-2 right-3 top-3"
                />
                <BsChatLeft />
            </button >

            {/* <!-- Dropdown Start --> */}
            < div
                ref={dropdown}
                onFocus={() => setDropdownOpen(true)}
                onBlur={() => setDropdownOpen(false)}
                className={`absolute -right-16 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-cyan-700 dark:bg-secondary-dark-bg sm:right-0 sm:w-80 ${dropdownOpen === true ? 'block' : 'hidden'
                    }`}
            >
                <div className="px-4 py-3">
                    <h5 className="text-sm font-medium text-bodydark2 dark:text-gray-400">Messages</h5>
                </div>

                <ul className="flex h-auto w-auto flex-col overflow-y-auto">
                    <li>
                        <Link
                            className="flex gap-4 border-t border-stroke px-4 py-3 hover:bg-gray-200 dark:border-cyan-700 dark:hover:bg-cyan-700"
                            to="/task_management/messages"
                        >

                            <img className="h-12 w-12 rounded-full" src={avatar} alt="User" />


                            <div>
                                <h6 className="text-sm font-medium text-black dark:text-white">
                                    Mariya Desoja
                                </h6>
                                <p className="text-sm dark:text-gray-400">I like your confidence 💪</p>
                                <p className="text-xs dark:text-gray-500">2min ago</p>
                            </div>
                        </Link>
                    </li>
                </ul>
            </div >
            {/* <!-- Dropdown End --> */}
        </div >
    );
};

export default DropdownMessage;
