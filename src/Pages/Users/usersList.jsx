// UserList.js

import React, { useEffect, useState } from 'react';
import avatar from '../../components/data/img_avatar2.png';
import { Link } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [showEditModal, setEditShowModal] = useState(null);
    const [showDeleteModal, setDeleteModal] = useState(null);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [updateUserId, setUpdateUserId] = useState(null);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [userData, setUserData] = useState({
        firstname: '',
        lastname: '',
        avatar: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiUrl}/api/users-list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            // Check if the response is successful (status 200)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse the response as JSON
            const data = await response.json();
            console.log(data);
            // Set the tasks in the state
            setUsers(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // Update user
    const handleUpdateUser = (user) => {
        setUpdateUserId(user.user_id);
        setUserData({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
        });
        setEditShowModal(user);
    };

    const confirmUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/api/user/${updateUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setEditShowModal(false)
            // Reload the page after successful updation
            window.location.reload();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDeleteUser = (user) => {
        setDeleteUserId(user.user_id);
        setDeleteModal(user);
    };

    const confirmDeleteUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/api/user/${deleteUserId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data); // User deleted successfully message

            // Handle any other logic after successful deletion

            // Close the delete modal
            setDeleteModal(false);
            // Reload the page after successful deletion
            window.location.reload();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div className="relative overflow-x-auto  sm:rounded-lg  pl-5 pr-5 pd-1">
            < div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-white dark:bg-gray-900" >
                <div className="text-2xl font-black text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 px-6 py-3">
                    User Details
                </div >
                {/* <div>
                    <button id="dropdownActionButton" onClick={() => setActionDropdow(!actionDropdown)} className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 
                    focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button"
                    >
                        <span className="sr-only">Action button</span>
                        Action
                        <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                        </svg>
                    </button>
                    {actionDropdown && (
                        <>
                            <div id="dropdownAction" className="absolute bg-white divide-y divide-gray-100 rounded-lg  w-44 dark:bg-gray-200 dark:divide-gray-600 " >
                                <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownActionButton" >
                                    <li>Delete</li>
                                    <li>
                                        yes <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                                    </li >
                                    <li>
                                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a>
                                    </li >
                                    <li>
                                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Activate account</a>
                                    </li >
                                </ul >
                                <div className="py-1" >
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white" > Delete User</a >
                                </div >
                            </div >
                        </>)}
                </div > */}
                <div className="flex items-center space-x-4">
                    <label htmlFor="table-search" className="sr-only">Search</label>
                    <div className="relative flex items-center">
                        <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="text" id="table-search-users" className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for users" />
                    </div>
                    {/* Add Project Icon Button */}
                    <Link to="/task_management/add-user" className="relative group flex-shrink-0">
                        <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                            <AiOutlinePlus size={24} />
                        </button>
                        {/* Tooltip */}
                        <span className="absolute left-1/2 mt-1 transform -translate-x-1/2 -translate-y-full text-white text-sm bg-gray-800 rounded-lg py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 before:absolute before:left-1/2 before:transform before:-translate-x-1/2 before:bottom-full before:content-[''] before:w-0 before:h-0 before:border-8 before:border-transparent before:border-b-gray-800 group-hover:before:border-b-gray-800">
                            AddUser
                        </span>
                    </Link>
                </div>
            </div >

            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" >
                <thead className="text-xl text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400" >
                    <tr>
                        <th scope="col" className="p-4">
                            Id
                        </th>
                        <th scope="col" className="px-6 py-3" >
                            User Name
                        </th >
                        <th scope="col" className="px-6 py-3" >
                            Email
                        </th >
                        <th scope="col" className="px-6 py-3" >
                            Role
                        </th >
                        <th scope="col" className="px-6 py-3" >
                            Action
                        </th >
                    </tr >
                </thead >
                <tbody>
                    {!users || users.length === 0 ? (
                        <tr>
                            <td colSpan="5" className='text-center'>---No users to display---</td>
                        </tr>
                    ) :
                        (users.map((user, index) => (
                            <tr key={user.user_id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="w-4 p-4">
                                    {index + 1}
                                </td>
                                <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white" >
                                    <img className="w-10 h-10 rounded-full" src={avatar} alt="Avatar" />
                                    <div className="ps-3" >
                                        <div className="text-base capitalize font-bold" > {user.firstname} {user.lastname}</div >
                                        <div className="font-normal text-gray-500" > {user.email}</div >
                                    </div >
                                </th >
                                <td className="px-6 py-4" >
                                    {user.email}
                                </td >
                                <td className="px-6 py-4" >
                                    <div className="flex items-center" >
                                        {user.role}
                                    </div >
                                </td >
                                <td className="px-6 py-4" >
                                    <input type="button" value="Edit" onClick={() => handleUpdateUser(user)} className="font-medium mr-3 text-blue-600 dark:text-blue-500 hover:underline cursor-pointer" />
                                    <input type="button" value="Delete" onClick={() => handleDeleteUser(user)} className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer" />
                                </td >
                            </tr >
                        )))
                    }
                </tbody >
            </table >
            {/* Edit User */}
            <div >
                {showEditModal ? (
                    <>
                        <div className="flex justify-center  items-center overflow-x-hidden overflow-y-auto fixed  inset-0 outline-none focus:outline-none " style={{ zIndex: '1300' }}>
                            <div className="relative w-full my-6 mx-auto max-w-3xl ">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none dark:bg-main-dark-bg">
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t dark:border-gray-600">
                                        <h3 className="text-3xl font=semibold dark:text-white">Edit User</h3>
                                        <button type="button"
                                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                            onClick={() => setEditShowModal(null)}
                                        >
                                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" >
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                            </svg >
                                            <span className="sr-only" > Close modal</span >
                                        </button >
                                    </div>
                                    <div className="relative p-6 flex-auto ">
                                        <form className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 w-full dark:bg-secondary-dark-bg">
                                            <div className="p-6 space-y-6" >
                                                <div className="grid grid-cols-6 gap-6" >
                                                    <div className="col-span-6 sm:col-span-3" >
                                                        <label for="first-name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" > First Name</label >
                                                        <input type="text" value={userData.firstname} name="first-name" id="first-name" onChange={(e) => setUserData({ ...userData, firstname: e.target.value })}
                                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                            placeholder="Bonnie" required />
                                                    </div >
                                                    <div className="col-span-6 sm:col-span-3" >
                                                        <label for="last-name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" > Last Name</label >
                                                        <input type="text" value={userData.lastname} name="last-name" id="last-name" onChange={(e) => setUserData({ ...userData, lastname: e.target.value })}
                                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                            placeholder="Green" required />
                                                    </div >
                                                    <div className="col-span-6 sm:col-span-3" >
                                                        <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" > Email</label >
                                                        <input type="email" value={userData.email} name="email" id="email" onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                            placeholder="example@company.com" required />
                                                    </div >
                                                    <div className="col-span-6 sm:col-span-3" >
                                                        <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>
                                                        <select id="role" name="role" value={userData.role} onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        >
                                                            <option value="Admin">Admin</option>
                                                            <option value="User">User</option>
                                                        </select>
                                                    </div >
                                                    <div className="col-span-6 sm:col-span-3" >
                                                        <label for="current-password" onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" > Current Password</label >
                                                        <input type="password" name="current-password" id="current-password" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="••••••••" required />
                                                    </div >
                                                    <div className="col-span-6 sm:col-span-3" >
                                                        <label for="new-password" onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" > New Password</label >
                                                        <input type="password" name="new-password" id="new-password" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="••••••••" required />
                                                    </div >
                                                </div >
                                            </div >
                                        </form>
                                    </div>
                                    <div className="flex items-center justify-end p border-t border-solid border-gray-300 dark:border-gray-600 rounded-b">
                                        <button
                                            className="text-red bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-blue-800"
                                            type="button"
                                            onClick={() => setEditShowModal(null)}
                                        >
                                            Close
                                        </button>
                                        <div className="flex items-center p-6 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b dark:border-gray-600" >
                                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                onClick={confirmUpdateUser}> Save all</button >
                                        </div >
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}
            </div >

            {/* Delete user */}
            <div>
                {showDeleteModal ? (
                    <>
                        <div className="flex justify-center  items-center overflow-x-hidden overflow-y-auto fixed inset-0 bg-black opacity-80 z-50 outline-none focus:outline-none" style={{ zIndex: '1100' }}>
                            <div className="relative w-full my-6 mx-auto max-w-2xl z-50">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none dark:bg-main-dark-bg">
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 dark:border-gray-600 rounded-t">
                                        <h3 className="text-2xl font-semibold dark:text-white">Are you sure you want to delete the user <span className='capitalize border-b border-gray-300 dark:border-gray-600'>{showDeleteModal.firstname}</span> ? </h3>
                                        <button type="button"
                                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                            onClick={() => setDeleteModal(null)}
                                        >
                                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" >
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                            </svg >
                                            <span className="sr-only" > Close modal</span >
                                        </button >
                                    </div>

                                    <div className="flex items-center justify-end p border-t border-solid border-gray-300 dark:border-gray-600 rounded-b">
                                        <button
                                            className="text-red bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                            type="button"
                                            onClick={() => setDeleteModal(null)}
                                        >
                                            Cancel
                                        </button>
                                        <div className="flex items-center p-6 space-x-3 rtl:space-x-reverse border-t border-gray-300 rounded-b dark:border-gray-700" >
                                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                onClick={confirmDeleteUser}>

                                                Delete</button >
                                        </div >
                                    </div>
                                </div>
                            </div>
                        </div >
                    </>
                ) : null}
            </div >

        </div >

    );
};

export default UserList;
