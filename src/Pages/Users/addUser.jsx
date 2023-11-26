import React, { useState } from 'react';
import axios from 'axios';
import "../Styles/addUser.css";
import { useNavigate } from 'react-router-dom';

const CreateUserForm = () => {
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
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
            const response = await axios.post('http://localhost:8080/api/add-user', userData, {
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
        <div className="user-form-container">
            {successMessage && <div className="success-message">{successMessage}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <h2>User Creation Form</h2>
            <form className="user-form" onSubmit={handleSubmit}>
                <div className="user-form-column">
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" id="firstName" value={userData.firstname} name="firstname"
                        placeholder='First name'
                        onChange={handleInputChange} required />

                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" id="lastName" value={userData.lastname} name="lastname"
                        placeholder='Last name'
                        onChange={handleInputChange} />

                    <label htmlFor="role">Role</label>
                    <select id="role" value={userData.role} name="role"
                        onChange={handleInputChange} required>
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                    </select>
                    <label htmlFor="avatar">
                        Avatar URL:
                        <input type="text" name="avatar" id="avatar" value={userData.avatar}
                            placeholder='url'
                            onChange={handleInputChange} />
                    </label>
                </div>

                <div className="user-form-column">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" value={userData.email} name="email"
                        placeholder='Email'
                        onChange={handleInputChange} required />

                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" value={userData.password} name="password"
                        placeholder='Password'
                        onChange={handleInputChange} required />

                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input type="password" id="confirmPassword" value={userData.confirmPassword} name="confirmPassword"
                        placeholder='Confirm Password'
                        onChange={handleInputChange} required />

                </div>
                <button type="submit" className='addUser' disabled={loading}>
                    {loading ? 'Adding User...' : 'Add User'}
                </button>
            </form>
        </div>
    );
};

export default CreateUserForm;
