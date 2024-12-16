import { Link } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { RiNotification3Line } from 'react-icons/ri';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotifications,markNotificationAsRead } from '../services/apiService';
import { useStateContext } from '../contexts/contextProvider';
import { Loader } from 'lucide-react';
import { formatDistanceToNowStrict, parseISO, addHours, addMinutes, } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const DropdownNotification = () => {
    const { role } = useStateContext();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const trigger = useRef(null);
    const dropdown = useRef(null);

    // Fetch notifications
    const { data: notifications, isLoading, isError } = useQuery({
        queryKey: ['notifications', role],
        queryFn: () => fetchNotifications(1, 5, role),
        refetchInterval: 30000,
        refetchOnWindowFocus: true,
    });

    const { mutate: markAsRead } = useMutation({
        mutationFn:markNotificationAsRead, 
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications', role]); // Refresh notifications
        },
    });

    const handleNotificationClick = (notification) => {
        if (!notification.is_read) {
            markAsRead(notification.id); // Update the `is_read` status in the backend
        }
        //navigate(`/notifications/${notification.id}`); // Navigate to the detailed page
    };

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
                className={`absolute -right-16 mt-2.5 flex max-h-72 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-cyan-700 dark:bg-secondary-dark-bg sm:right-0 sm:w-80 ${dropdownOpen === true ? 'block' : 'hidden'
                    }`}
            >
                <div className="px-4 py-3">
                    <h5 className="text-sm font-medium text-bodydark2 dark:text-gray-400">Notification</h5>
                </div>

                <ul className="flex h-auto flex-col overflow-y-auto">
                    {isLoading ? (
                        <li className="px-4 py-4 sm:px-6 text-center">
                            <Loader className="h-6 w-6 text-blue-500 animate-spin inline-block" />
                            <span className="ml-2 text-gray-500">Loading...</span>
                        </li>
                    ) : isError ? (
                        <li className="px-4 py-4 sm:px-6 text-center text-red-500">
                            Error loading updates
                        </li>
                    ) : (!notifications || notifications.length === 0) ? (
                        <li className="px-4 py-4 sm:px-6 text-center text-gray-500">No notifications available.</li>
                    ) : (notifications.map((notification) => (
                        <li key={notification.id}>
                          <button
                            onClick={() => handleNotificationClick(notification)}
                            className={`flex flex-col w-full text-left gap-2.5 border-t border-stroke px-4 py-3 hover:bg-gray-200 dark:border-cyan-700 dark:hover:bg-cyan-700 
                                ${!notification.is_read ? 'bg-gray-100 dark:bg-gray-800 font-bold' : 'bg-white dark:bg-secondary-dark-bg'}`}
                        >
                            <p className="text-sm dark:text-gray-400">
                                <span className={`${!notification.is_read ? 'text-black dark:text-white' : 'text-bodydark2 dark:text-gray-400'}`}>
                                    {notification.message}
                                </span>{' '}
                                ({notification.type})
                            </p>
                            <p className="text-xs dark:text-gray-500">
                                {formatDistanceToNowStrict(
                                    addMinutes(addHours(parseISO(notification.created_at), -5), -30)
                                )} ago
                            </p>
                        </button>
                        </li>
                    ))
                    )}
                </ul>
            </div>
        </div >
    );
};

export default DropdownNotification;