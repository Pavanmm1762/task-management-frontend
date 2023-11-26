import React, { useState } from 'react';
import "../Styles/newProject.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const ProjectForm = () => {
    const navigate = useNavigate();
    const [projectData, setProjectData] = useState({
        name: '',
        description: '',
        startDate: '',
        dueDate: '',
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
            const unixStartDate = Math.floor(new Date(projectData.startDate).getTime() / 1000);
            const unixDueDate = Math.floor(new Date(projectData.dueDate).getTime() / 1000);
            const UpdateProject = {
                name: projectData.name,
                description: projectData.description,
                startDate: unixStartDate,
                dueDate: unixDueDate,
            }

            const token = localStorage.getItem('token');
            const response = await axios.post("http://localhost:8080/api/project", UpdateProject, {
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

            console.log('Project Data Submitted:', UpdateProject, response.data);
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
        <div>
            {successMessage && <div className="success-message">{successMessage}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <h2>Create your new project</h2>
            <form onSubmit={handleSubmit} className='projectCreateFrom'>
                <label>
                    Project Name:
                    <input
                        type="text"
                        name="name"
                        placeholder='Project name'
                        value={projectData.name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Project Description:
                    <textarea
                        name="description"
                        placeholder='Project description'
                        value={projectData.description}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Start Date:
                    <input
                        type="date"
                        name="startDate"
                        value={projectData.startDate}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <label>
                    Due Date:
                    <input
                        type="date"
                        name="dueDate"
                        value={projectData.dueDate}
                        onChange={handleChange}
                        required
                    />
                </label>
                <br />
                <button type="submit" className='createProject' disabled={loading}>
                    {loading ? 'Creating Project...' : 'Create Project'}
                </button>
            </form>
        </div>
    );
};

export default ProjectForm;
