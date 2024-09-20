import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import avatar from '../components/data/img_avatar2.png';

const DashboardUserChats = () => {
    const [usersMessages, setUserDetails] = useState([]);

    useEffect(() => {
        fetchUserChats();
    }, []);

    const fetchUserChats = async () => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiUrl}/api/users-list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token} `,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} `);
            }

            // Parse the response as JSON
            const data = await response.json();
            console.log(data);
            // Set the tasks in the state
            setUserDetails(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    return (
        <div className="col-span-12 mr-5 sm:ml-0 ml-5 rounded-xl border  border-stroke bg-white py-6 shadow-default dark:border-cyan-700  dark:bg-secondary-dark-bg xl:col-span-4">
            <h4 className="mb-6 px-7 text-xl font-semibold text-black dark:text-white">
                Chats
            </h4>
            <div>
                {!usersMessages || usersMessages.length === null ? (
                    <tr>
                        <td className="text-center">---No Messages---</td>
                    </tr>
                ) :
                    (usersMessages.map((users) => (
                        <Link
                            // onClick = { handleChat }
                            className="flex items-center gap-5 py-3 px-7 hover:bg-gray-200 dark:hover:bg-cyan-700"
                        >
                            <div className="relative ">
                                <img className=" h-14 w-14 rounded-full" src={avatar} alt=" User" />
                                <span className="absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white  bg-slate-500"></span>
                            </div>

                            <div className="flex flex-1 items-center justify-between">
                                <div>
                                    <h5 className="font-medium text-black dark:text-white">
                                        {users.firstname}
                                    </h5>
                                    <p>
                                        <span className="text-sm text-black dark:text-white">
                                            Hello, how are you?
                                        </span>
                                        <span className="text-xs dark:text-white"> . 12 min</span>
                                    </p>
                                </div>
                                <div className="flex h-6 w-6 items-center justify-center rounded-full  bg-slate-500">
                                    <span className="text-sm font-medium text-white">3</span>
                                </div>
                            </div>
                        </Link>
                    )))
                }
            </div>
        </div>
    );

};

export default DashboardUserChats;