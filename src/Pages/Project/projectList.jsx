import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetchProjects();
    }, []);


    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiUrl}/api/projects`, {
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
            setProjects(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    return (
        <div className="relative overflow-x-auto xs:mt-10 sm:rounded-lg md:overflow-x-hidden pl-5 pr-5 pd-1 ">
            < div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-white dark:bg-gray-900" >
                <div className="text-2xl font-black text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 px-6 py-3">
                    Projects Details
                </div >
                <div className="flex items-center space-x-4">
                    <label htmlFor="table-search" className="sr-only">Search</label>
                    <div className="relative flex items-center">
                        <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="text" id="table-search-users" className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-60 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for projects" />
                    </div>
                    {/* Add Project Icon Button */}
                    <Link to="/task_management/create-project" className="relative group">
                        <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                            <AiOutlinePlus size={24} />
                        </button>
                        {/* Tooltip */}
                        <span className="absolute mt-1 left-1/2 transform -translate-x-1/2 -translate-y-full text-white text-sm bg-gray-800 rounded-lg py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            AddProject
                        </span>
                    </Link>
                </div>
            </div>
            <table className="min-w-full  divide-y divide-gray-200 leading-normal text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" >
                <thead className="text-base text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400" >
                    <tr>
                        <th scope="col" className="p-4">
                            Id
                        </th>
                        <th scope="col" className="px-6 py-3" >
                            Project Name
                        </th >
                        <th scope="col" className="px-6 py-3" >
                            Start Date
                        </th >
                        <th scope="col" className="px-6 py-3" >
                            Due Date
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
                    {!projects || projects.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center">---No projects to display---</td>
                        </tr>
                    ) :
                        (projects.map((projects, index) => (
                            <tr key={projects.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <td className="w-4 p-4">
                                    {index + 1}
                                </td>
                                <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white" >
                                    <div className="ps-3" >
                                        <div className="text-base font-bold capitalize" > {projects.name} </div >
                                        <div className="font-normal text-gray-500  max-w-[200px] lg:max-w-[400px] whitespace-normal line-clamp-3 max-h-15 overflow-hidden" > {projects.description}</div >
                                    </div >
                                </th >
                                <td className="px-6 py-4" >
                                    {projects.start_date}
                                </td >
                                <td className="px-6 py-4" >
                                    <div className="flex items-center" >
                                        {projects.due_date}
                                    </div >
                                </td >
                                <td className="px-6 py-4" >
                                    <div className="flex items-center" >
                                        {projects.status}
                                    </div >
                                </td >
                                <td className="px-6 py-4" >
                                    <div className="flex items-center text-blue-700 hover:underline" >
                                        {/* <button id="dropdownActionButton"
                                            className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button"
                                            onClick={() => handleViewDetails(projects)} >
                                            <span className="sr-only">Project View</span>
                                            View
                                        </button> */}
                                        <Link to={`/project/${projects.id}`} >
                                            View
                                        </Link>
                                    </div >
                                </td >
                            </tr >
                        )))
                    }
                </tbody >
            </table >

        </div >

    );

};

export default ProjectList;