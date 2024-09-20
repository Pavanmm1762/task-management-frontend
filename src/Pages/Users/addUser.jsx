import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const CreateUserForm = () => {
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;

    const [userData, setUserData] = useState({
        firstname: '',
        lastname: '',
        avatar: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'User', // Default role
    });

    const handleInputChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true)
            const token = localStorage.getItem('token');
            const response = await axios.post(`${apiUrl}/api/add-user`, userData, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            setSuccessMessage('User successfully added!');

            setTimeout(() => {
                navigate('/task_management/users-list');
            }, 3000); // 2000 milliseconds (2 seconds) delay

            console.log('Project Data Submitted:', userData, response.data);

            // Handle the response, e.g., show a success message
            console.log(response.data);
        } catch (error) {
            // Handle errors, e.g., show an error message
            console.error('Error creating user:', error.response.data);
            setErrorMessage('Error creating project. Please try again.');
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }

    };

    return (
        <div className="mx-auto max-w-3xl mt-5 bg-white shadow-md rounded p-8  dark:bg-secondary-dark-bg">
            {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
            {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
            <h2 className="text-2xl font-bold mb-4 dark:text-white">User Creation Form</h2>
            <form className="user-form grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
                <div className="col-span-1">
                    <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">First Name</label>
                    <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        id="firstName"
                        value={userData.firstname}
                        name="firstname"
                        placeholder="First name"
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="col-span-1">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={userData.email}
                        name="email"
                        placeholder="Email"
                        onChange={handleInputChange}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                    />
                </div>

                <div className="col-span-1">
                    <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        value={userData.lastname}
                        name="lastname"
                        placeholder="Last name"
                        onChange={handleInputChange}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                </div>

                <div className="col-span-1">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={userData.password}
                        name="password"
                        placeholder="Password"
                        onChange={handleInputChange}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                    />
                </div>

                <div className="col-span-1">
                    <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Role</label>
                    <select
                        id="role"
                        value={userData.role}
                        name="role"
                        onChange={handleInputChange}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                    >
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                    </select>
                </div>

                <div className="col-span-1">
                    <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={userData.confirmPassword}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        onChange={handleInputChange}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                    />
                </div>

                <div className="col-span-1">
                    <label htmlFor="avatar" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Avatar URL</label>
                    <input
                        type="text"
                        name="avatar"
                        id="avatar"
                        value={userData.avatar}
                        placeholder="URL"
                        onChange={handleInputChange}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                </div>

                <div className="col-span-2">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={loading}
                    >
                        {loading ? 'Adding User...' : 'Add User'}
                    </button>
                    <Link to="/task_management/users-list">
                        <button
                            type="submit"
                            className="bg-red-500 ml-5 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </Link>
                </div>
            </form >
        </div >

    );
};

export default CreateUserForm;
