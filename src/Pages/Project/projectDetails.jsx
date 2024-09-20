// ProjectDetails.js

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProjectDetails = () => {
    const navigate = useNavigate();
    const [selectedProject, setSelectedProject] = useState('');
    const [taskLists, setTaskLists] = useState([]);
    const [showEditModal, setEditShowModal] = useState(null);
    const [showDeleteModal, setDeleteModal] = useState(null);
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;

    const [projectData, setProjectData] = useState({
        name: '',
        description: '',
        startDate: '',
        dueDate: "",
        status: '',
    });
    const [taskData, setTaskData] = useState({
        task_id: null,
        task_name: '',
        description: '',
        progress: 0,
        status: 'started',
    });

    const { projectId } = useParams();

    const fetchProjectDetails = useCallback(async (projectId) => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl1 = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiUrl1}/api/project/${projectId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setSelectedProject(data); // Set the fetched project details
        } catch (error) {
            console.error('Error fetching project details:', error);
        }

    }, []);

    // Add task
    const handleAddTaskModel = (task) => {
        setTaskData({
            task_id: '',
            task_name: '',
            description: '',
            progress: 0,
            status: 'started',
        });
        setShowAddTaskModal(true);
    };

    //add task to the project
    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            // setLoading(true)
            const token = localStorage.getItem('token');
            delete taskData.task_id;
            const response = await axios.post(`${apiUrl}/api/project/add-task/${projectId}`, taskData, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            },);
            // Display success message
            //  setSuccessMessage('Project successfully created!');
            setTaskData({
                task_name: '',
                description: '',
                progress: 0,
                status: 'started',
            });
            setShowAddTaskModal(false)
            // Update the state locally by adding the new task
            setTaskLists((prevTasks) => [...prevTasks, response.data]);
            console.log('Task Data added:', taskData, response.data);
        } catch (error) {
            console.error("Error during add task:", error.response ? error.response.data : error.message);
            // setErrorMessage('Error adding task. Please try again.');
        } finally {
            // setTimeout(() => {
            //     setLoading(false);
            // }, 2000);
        }

    };

    // Update project
    const handleUpdateProject = (project) => {
        console.log(project);
        setProjectData({
            name: project.name,
            description: project.description,
            startDate: project.start_date.replace(', ', 'T'),
            dueDate: project.due_date.replace(', ', 'T'),
            status: project.status,
        });
        setEditShowModal(projectData);
    };
    const confirmUpdateProject = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const dataToSend = {
                ...projectData,
                start_date: projectData.startDate.replace('T', ', '),
                due_date: projectData.dueDate.replace('T', ', '),
            };

            const response = await fetch(`${apiUrl}/api/project/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setEditShowModal(false)
            // Reload the page after successful deletion
            window.location.reload();
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    //delete the project
    const handleDeleteProject = (project) => {
        setDeleteModal(project);
    };
    const confirmDeleteProject = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/api/project/${projectId}`, {
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
            console.log(data); // Project deleted successfully message

            // Handle any other logic after successful deletion

            // Close the delete modal
            setDeleteModal(false);
            // Reload the page after successful deletion
            navigate('/task_management/project-lists');
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    //task list
    const fetchTaskDetails = useCallback(async (projectId) => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl2 = process.env.REACT_APP_API_URL;
            const response = await axios.get(`${apiUrl2}/api/project/tasks/${projectId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.data) {
                throw new Error('No task details found');
            }
            setTaskLists(response.data)
            console.log('Task details:', response.data);
        } catch (error) {
            console.error('Error fetching task details:', error.message);
            // Handle the error (show a message or perform other actions)
        }
    }, []);

    // Show edit task model
    const handleUpdateTaskModel = (task) => {
        setTaskData({
            task_id: task.task_id,
            task_name: task.task_name || '', // Default to empty string
            description: task.description || '', // Default to empty string
            progress: task.progress || 0, // Default to 0
            status: task.status || 'started', // Default status
        });
        setShowAddTaskModal(task);
    };
    //update task
    const handleUpdateTask = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const { task_id, ...dataToUpdate } = taskData; // Spread to exclude task_id
            console.log(dataToUpdate);
            const response = await axios.put(`${apiUrl}/api/projects/${projectId}/tasks/${task_id}`, dataToUpdate, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            // Update taskLists with the updated task
            // setTaskLists((prevTasks) => prevTasks.map(task => task.task_id === task_id ? response.data : taskLists));
            console.log(response.data);
            setShowAddTaskModal(false); // Close modal
            window.location.reload();
        } catch (error) {
            console.error('Error updating task:', error.response ? error.response.data : error.message);
        }
    };

    //delete task
    const handleDeleteTask = async (deleteTaskId) => {

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/api/tasks/${deleteTaskId}`, {
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

            // Update the state locally by removing the deleted task
            setTaskLists((prevTasks) => prevTasks.filter(task => task.task_id !== deleteTaskId));

            // // Handle any other logic after successful deletion
            // // Reload the page after successful deletion
            // window.location.reload();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    useEffect(() => {
        if (projectId) {
            fetchProjectDetails(projectId);
            fetchTaskDetails(projectId)
        }
    }, [projectId, fetchProjectDetails, fetchTaskDetails]);

    return (
        <div>
            <div className="relative m-5 h-full bg-gray-200 flex items-center justify-center dark:bg-main-dark-bg">
                <div className="bg-white p-8 rounded-md border-stroke border min-w-full sm:w-[80%] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-8 relative dark:border-cyan-700 dark:bg-secondary-dark-bg">
                    {/* Left Side: Name and Description */}
                    <div>
                        <h2 className="text-xl text-gray-700 mt-5 dark:text-gray-100">
                            <strong>Project Name:</strong>
                        </h2>
                        <h2 className="mb-2 ml-2 font-bold text-md dark:text-gray-200">{selectedProject?.name}</h2>

                        <h2 className="text-gray-700 mt-4 dark:text-white">
                            <strong>Description:</strong>
                        </h2>
                        <p className="ml-2 font-medium dark:text-gray-300">{selectedProject?.description}</p>
                    </div>

                    {/* Right Side: Dates and Status */}
                    <div className="mt-4 sm:mt-0">
                        <div className="mb-3 mt-6">
                            <h2 className="text-gray-700 dark:text-white ">
                                <strong>Start Date:</strong>
                            </h2>
                            <p className="ml-3 text-gray-700 font-medium dark:text-gray-300"> {selectedProject?.start_date}</p>
                        </div>

                        <div className="mb-3">
                            <h2 className="text-gray-700 mt-4 dark:text-white">
                                <strong>End Date:</strong>
                            </h2>
                            <p className="ml-3 text-gray-700 font-medium  dark:text-gray-300"> {selectedProject?.due_date}</p>
                        </div>

                        <div className="mb-3">
                            <h2 className="text-gray-700 mt-4 dark:text-white">
                                <strong>Status:</strong>
                            </h2>
                            <p className="ml-3 text-gray-700 font-medium dark:text-gray-300 "> {selectedProject?.status}</p>
                        </div>
                    </div>

                    {/* Close button */}
                    <Link
                        className="absolute top-3 left-2 inline-flex items-center px-2 py-1 border-b border-gray-300 rounded-md font-semibold text-gray-700 bg-white hover:bg-gray-100 focus:outline-none dark:bg-blue-700"
                        to="/task_management/project-lists"
                    >
                        Back
                    </Link>

                    {/* Edit and Delete buttons */}
                    <div className="absolute bottom-4 right-4 sm:static mt-4 space-x-2">
                        <button
                            className="inline-flex items-center px-2 py-1 border border-blue-500 rounded-md font-semibold text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
                            onClick={() => handleUpdateProject(selectedProject)}
                        >
                            Edit
                        </button>
                        <button
                            className="inline-flex items-center px-2 py-1 border border-red-500 rounded-md font-semibold text-white bg-red-500 hover:bg-red-600 focus:outline-none"
                            onClick={() => handleDeleteProject(selectedProject)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* Members and Tasks */}
            < div className="flex flex-col sm:flex-row bg-white m-5 rounded-md mt-2 space-y-8 sm:space-y-0 sm:space-x-5 dark:bg-main-dark-bg">
                {/* Team Members */}
                <div className="bg-white border-stroke border p-3 rounded-md min-w-max dark:border-cyan-700 dark:bg-secondary-dark-bg">
                    <div className="text-md font-bold text-gray-700 uppercase dark:text-gray-100 px-2 py-1">
                        Team members
                    </div >
                    {/* You can fetch and display team members using a similar approach as project details */}
                    <p>Team members go here...</p>
                </div>

                {/* Task Details */}
                <div className="w-full bg-white border-stroke border overflow-y-auto p-3 rounded-md dark:bg-gray-900 dark:border-cyan-700 dark:bg-secondary-dark-bg">
                    < div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-1"  >
                        <div className="text-md font-bold text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-2 py-1">
                            Task List:
                        </div >
                        <label for="table-search" className="sr-only" > Search</label >
                        <div className="relative" >
                            <button
                                className=" inline-flex items-center mb-2 px-2 py-1 border border-green-500 rounded-md font-semibold text-white bg-green-500 hover:bg-green-600 focus:outline-none"
                                onClick={() => handleAddTaskModel()}
                            >
                                + Add Task
                            </button>
                        </div >
                    </div >
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" >
                        <thead className="text-base text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400" >
                            <tr>
                                <th scope="col" className="p-2">
                                    Id
                                </th>
                                <th scope="col" className="px-6 py-3" >
                                    Task
                                </th >
                                <th scope="col" className="px-6 py-3" >
                                    Description
                                </th >
                                <th scope="col" className="px-6 py-3" >
                                    Status
                                </th >
                                <th scope="col" className="px-6 py-3" >
                                    Action
                                </th >
                            </tr >
                        </thead >
                        <tbody>
                            {!taskLists || taskLists.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className='text-center'>---No tasks to display---</td>
                                </tr>
                            ) :
                                (taskLists.map((tasks, index) => (
                                    <tr key={tasks.task_id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="w-4 p-4">
                                            {index + 1}
                                        </td>
                                        <th scope="row" className="flex items-center px-2 py-4 text-gray-900 whitespace-nowrap dark:text-white" >
                                            <div className="ps-3" >
                                                <div className="text-base capitalize font-bold" > {tasks.task_name} </div >
                                            </div >
                                        </th >
                                        <td className="px-6 py-3" >
                                            {tasks.description}
                                        </td >
                                        <td className="px-6 py-3" >
                                            <div className="flex items-center" >
                                                {tasks.status}
                                            </div >
                                        </td >
                                        <td className="px-6 py-4" >
                                            <input type="button" value="Edit" onClick={() => handleUpdateTaskModel(tasks)} className="font-medium mr-3 text-blue-600 dark:text-blue-500 hover:underline cursor-pointer" />
                                            <input type="button" value="Delete" onClick={() => handleDeleteTask(tasks.task_id)} className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer" />
                                        </td >
                                    </tr >
                                )))
                            }
                        </tbody >
                    </table>
                </div>
            </div >

            {/* Add/Edit task model */}
            <div >
                {showAddTaskModal ? (
                    <>
                        <div className="flex justify-center  items-center overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none " style={{ zIndex: '1300' }}>
                            <div className="relative w-full my-6 mx-auto max-w-3xl ">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none dark:bg-main-dark-bg">
                                    <div className="flex items-start justify-between p-3 border-b border-solid border-gray-300 rounded-t dark:border-gray-600">
                                        <h3 className="text-2xl font=semibold dark:text-white">
                                            {taskData?.task_id ? `Edit Task For ${selectedProject?.name}` : `New Task For ${selectedProject?.name}`}
                                        </h3>
                                        <button type="button"
                                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                            onClick={() => setShowAddTaskModal(false)}
                                        >
                                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" >
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                            </svg >
                                            <span className="sr-only" > Close modal</span >
                                        </button >
                                    </div>
                                    <div className="relative p-5 flex-auto ">
                                        <form className="bg-gray-200 shadow-md rounded px-5 pt-4 pb-5 w-full dark:bg-secondary-dark-bg">
                                            <div className="p-6 space-y-6" >
                                                <div className=" " >
                                                    <div className="col-span-6 sm:col-span-3" >
                                                        <label for="task_name" className="block mb-2 text-md font-medium text-gray-900 dark:text-white" > Task Name</label >
                                                        <input type="text" value={taskData.task_name} name="task_name" id="task_name" onChange={(e) => setTaskData({ ...taskData, task_name: e.target.value })}
                                                            className="shadow-sm mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                            placeholder="Sample task" required />
                                                    </div >
                                                    <div className="col-span-6 sm:col-span-3" >
                                                        <label for="description"
                                                            className="block mb-2 text-md font-medium text-gray-900 dark:text-white " > Description</label >
                                                        <textarea value={taskData.description}
                                                            onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                                                            name="description" id="description" className="shadow-sm mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Brief Description" required />
                                                    </div >

                                                    <div className="col-span-6 sm:col-span-3" >
                                                        <label htmlFor="status" className="block mb-2 text-m font-medium text-gray-900 dark:text-white">Status</label>
                                                        <select id="status" name="status" value={taskData.status} onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
                                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        >
                                                            <option value="Started">Started</option>
                                                            <option value="Pending">Pending</option>
                                                            <option value="On progress">On progress</option>
                                                            <option value="Completed">Completed</option>
                                                        </select>
                                                    </div >

                                                </div >
                                            </div >
                                        </form>
                                    </div>
                                    <div className="flex items-center justify-end p border-t border-solid border-gray-300 dark:border-gray-600 rounded-b">
                                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                            onClick={taskData?.task_id ? handleUpdateTask : handleAddTask}
                                        >{taskData?.task_id ? 'Update' : 'Add'}</button >
                                        <div className="flex items-center p-6 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b dark:border-gray-600" >
                                            <button
                                                className="text-red bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-blue-800"
                                                type="button"
                                                onClick={() => setShowAddTaskModal(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div >
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}
            </div >

            {/* Edit Project */}
            <div >
                {showEditModal ? (
                    <>
                        <div className="flex justify-center  items-center overflow-x-hidden overflow-y-auto fixed  inset-0 outline-none focus:outline-none " style={{ zIndex: '1300' }}>
                            <div className="relative w-full my-6 mx-auto max-w-3xl ">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none dark:bg-main-dark-bg">
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t dark:border-gray-600">
                                        <h3 className="text-3xl font=semibold dark:text-white">Update Project</h3>
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
                                                        <label for="project-name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" > Project Name</label >
                                                        <input type="text" value={projectData.name} name="project-name" id="project-name" onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                            placeholder="New project" required />
                                                    </div >
                                                    <div className="col-span-6 sm:col-span-3" >
                                                        <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                                                        <select id="status" name="status" value={projectData.status} onChange={(e) => setProjectData({ ...projectData, status: e.target.value })}
                                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        >
                                                            <option value="Not Started">Not Started</option>
                                                            <option value="In Progress">In Progress</option>
                                                            <option value="Completed">Completed</option>
                                                        </select>
                                                    </div >
                                                    <div className="col-span-6 sm:col-span-3" >
                                                        <label for="startDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" > Start Date</label >
                                                        <input type="datetime-local" value={projectData.startDate} name="startDate" id="startDate" onChange={(e) => setProjectData({ ...projectData, startDate: e.target.value })}
                                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                            placeholder="example@company.com" required />
                                                    </div >
                                                    <div className="col-span-6 sm:col-span-3" >
                                                        <label for="dueDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" > Due Date</label >
                                                        <input type="datetime-local" value={projectData.dueDate} name="dueDate" id="dueDate" onChange={(e) => setProjectData({ ...projectData, dueDate: e.target.value })}
                                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                            placeholder="Green" required />
                                                    </div >
                                                    <div className="col-span-6 md:col-span-6 sm:col-span-3" >
                                                        <label for="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" > Description</label >
                                                        <textarea name=" description" value={projectData.description} id="description" onChange={(e) => setProjectData({ ...projectData, password: e.target.value })}
                                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                            placeholder="project description" required />
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
                                                onClick={confirmUpdateProject}> Save all</button >
                                        </div >
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}
            </div >

            {/* Delete project */}
            <div>
                {showDeleteModal ? (
                    <>
                        <div className="flex justify-center  items-center overflow-x-hidden overflow-y-auto fixed inset-0 bg-black opacity-80 z-50 outline-none focus:outline-none" style={{ zIndex: '1100' }}>
                            <div className="relative w-full my-6 mx-auto max-w-2xl z-50">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none dark:bg-main-dark-bg">
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 dark:border-gray-600 rounded-t">
                                        <h3 className="text-2xl font-semibold dark:text-white">Are you sure you want to delete the Project- <span className='capitalize border-b border-gray-300 dark:border-gray-600'>{showDeleteModal.name}</span> ? </h3>
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
                                                onClick={confirmDeleteProject}>

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
    )
};

export default ProjectDetails;
