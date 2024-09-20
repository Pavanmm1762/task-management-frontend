import { Link } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { RiNotification3Line } from 'react-icons/ri';


const DropdownNotification = () => {
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
                className="relative text-2xl rounded-full p-3 hover:bg-light-gray"
            >
                <span
                    style={{ background: "#03C9D7" }}
                    className="absolute inline-flex rounded-full h-2 w-2 right-3 top-3"
                />
                <RiNotification3Line />
            </button >

            <div
                ref={dropdown}
                onFocus={() => setDropdownOpen(true)}
                onBlur={() => setDropdownOpen(false)}
                className={`absolute -right-16 mt-2.5 flex h-72 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-cyan-700 dark:bg-secondary-dark-bg sm:right-0 sm:w-80 ${dropdownOpen === true ? 'block' : 'hidden'
                    }`}
            >
                <div className="px-4 py-3">
                    <h5 className="text-sm font-medium text-bodydark2 dark:text-gray-400">Notification</h5>
                </div>

                <ul className="flex h-auto flex-col overflow-y-auto">
                    <li>
                        <Link
                            className="flex flex-col gap-2.5 border-t border-stroke px-4 py-3 hover:bg-gray-200 dark:border-cyan-700  dark:hover:bg-cyan-700"
                            to="#"
                        >
                            <p className="text-sm dark:text-gray-400">
                                <span className="text-black dark:text-white">
                                    Edit your information in a swipe
                                </span>{' '}
                                Sint occaecat cupidatat non proident, sunt in culpa qui officia
                                deserunt mollit anim.
                            </p>

                            <p className="text-xs dark:text-gray-500">12 May, 2025</p>
                        </Link>
                    </li>
                    <li>
                        <Link
                            className="flex flex-col gap-2.5 border-t border-stroke px-4 py-3 hover:bg-gray-200 dark:border-cyan-700  dark:hover:bg-cyan-700"
                            to="#"
                        >
                            <p className="text-sm dark:text-gray-400">
                                <span className="text-black dark:text-white">
                                    It is a long established fact
                                </span>{' '}
                                that a reader will be distracted by the readable.
                            </p>

                            <p className="text-xs dark:text-gray-500">24 Feb, 2025</p>
                        </Link>
                    </li>
                    <li>
                        <Link
                            className="flex flex-col gap-2.5 border-t border-stroke px-4 py-3 hover:bg-gray-2 dark:border-cyan-700  dark:hover:bg-cyan-700"
                            to="#"
                        >
                            <p className="text-sm dark:text-gray-400">
                                <span className="text-black dark:text-white">
                                    There are many variations
                                </span>{' '}
                                of passages of Lorem Ipsum available, but the majority have
                                suffered
                            </p>

                            <p className="text-xs dark:text-gray-500">04 Jan, 2025</p>
                        </Link>
                    </li>
                    <li>
                        <Link
                            className="flex flex-col gap-2.5 border-t border-stroke px-4 py-3 hover:bg-gray-2 dark:border-cyan-700  dark:hover:bg-cyan-700"
                            to="#"
                        >
                            <p className="text-sm dark:text-gray-400">
                                <span className="text-black dark:text-white">
                                    There are many variations
                                </span>{' '}
                                of passages of Lorem Ipsum available, but the majority have
                                suffered
                            </p>

                            <p className="text-xs dark:text-gray-500">01 Dec, 2024</p>
                        </Link>
                    </li>
                </ul>
            </div>
        </div >
    );
};

export default DropdownNotification;