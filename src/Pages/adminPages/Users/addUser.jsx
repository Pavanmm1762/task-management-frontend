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
        role: 'User',
    });

    const handleInputChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (userData.password !== userData.confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.post(`${apiUrl}/api/add-user`, userData, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            setSuccessMessage('User successfully added!');
            setErrorMessage('');

            setTimeout(() => {
                navigate('/task_management/users-list');
            }, 2000);

            console.log('User Data Submitted:', userData, response.data);
        } catch (error) {
            console.error('Error creating user:', error?.response?.data || error.message);
            setErrorMessage('Error creating user. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto mt-5 bg-white shadow-md rounded p-8 max-w-4xl dark:bg-secondary-dark-bg">
            {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
            {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Create New User</h2>
            <form className="user-form grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="firstname" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">First Name</label>
                    <input
                        type="text"
                        id="firstname"
                        name="firstname"
                        value={userData.firstname}
                        onChange={handleInputChange}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="First name"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="lastname" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Last Name</label>
                    <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        value={userData.lastname}
                        onChange={handleInputChange}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Last name"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Email"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Role</label>
                    <select
                        id="role"
                        name="role"
                        value={userData.role}
                        onChange={handleInputChange}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        required
                    >
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={userData.password}
                        onChange={handleInputChange}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Password"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={userData.confirmPassword}
                        onChange={handleInputChange}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Confirm Password"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="avatar" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Avatar URL</label>
                    <input
                        type="text"
                        id="avatar"
                        name="avatar"
                        value={userData.avatar}
                        onChange={handleInputChange}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Avatar URL"
                    />
                </div>

                <div className="col-span-2 flex justify-between items-center mt-4">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={loading}
                    >
                        {loading ? 'Adding User...' : 'Add User'}
                    </button>
                    <Link to="/task_management/users-list">
                        <button
                            type="button"
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default CreateUserForm;
