import React, { useState } from 'react';
import "../Styles/newProject.css";
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';


const ProjectForm = () => {
    const navigate = useNavigate();
    const [projectData, setProjectData] = useState({
        name: '',
        description: '',
        startDate: '',
        dueDate: '',
        status: 'Not Started',
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true)
            // Prepare projectData to be sent to the backend
            const dataToSend = {
                ...projectData,
                start_date: projectData.startDate.replace('T', ', '),
                due_date: projectData.dueDate.replace('T', ', '),
            };

            const token = localStorage.getItem('token');
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await axios.post(`${apiUrl}/api/project`, dataToSend, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            },);
            // Display success message
            setSuccessMessage('Project successfully created!');

            setTimeout(() => {
                navigate('/task_management/project-lists');
            }, 2000); // 2000 milliseconds (2 seconds) delay

            console.log('Project Data Submitted:', dataToSend, response.data);
        } catch (error) {
            console.error("Error during create project:", error.response ? error.response.data : error.message);
            setErrorMessage('Error creating project. Please try again.');
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }

    };

    return (
        <div className="grid grid-cols-1 shadow-md m-5 gap-4 p-6 dark:bg-secondary-dark-bg">
            {successMessage && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4">{successMessage}</div>}
            {errorMessage && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">{errorMessage}</div>}
            <h2 className="text-2xl font-semibold mb-4 dark:text-white">Create Your New Project</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                    <span className="font-semibold mb-2 dark:text-white">Project Name:</span>
                    <input
                        type="text"
                        name="name"
                        placeholder="Project name"
                        value={projectData.name}
                        onChange={handleChange}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                    />
                </label>

                <label className="flex flex-col">
                    <span className="font-semibold mb-2 dark:text-white">Project Status:</span>
                    <select
                        name="status"
                        value={projectData.status}
                        onChange={handleChange}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                    >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </label>

                <label className="flex flex-col">
                    <span className="font-semibold mb-2 dark:text-white">Start Date:</span>
                    <input
                        type="datetime-local"
                        name="startDate"
                        value={projectData.startDate}
                        onChange={handleChange}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                    />
                </label>

                <label className="flex flex-col">
                    <span className="font-semibold mb-2 dark:text-white">Due Date:</span>
                    <input
                        type="datetime-local"
                        name="dueDate"
                        value={projectData.dueDate}
                        onChange={handleChange}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                    />
                </label>

                <label className="flex flex-col">
                    <span className="font-semibold mb-2 dark:text-white">Project Description:</span>
                    <textarea
                        name="description"
                        placeholder="Project description"
                        value={projectData.description}
                        onChange={handleChange}
                        className="shadow-sm bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                    />
                </label>
                <div className="col-span-2">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={loading}
                    >
                        {loading ? 'Creating Project...' : 'Create Project'}
                    </button>
                    <Link to="/task_management/project-lists">
                        <button
                            type="submit"
                            className="bg-red-500 ml-5 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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

export default ProjectForm;
