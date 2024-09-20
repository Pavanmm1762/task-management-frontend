import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const DashboardProjects = () => {
    const [projects, setProjects] = useState([]);

    // Using useCallback to memoize fetchProjects and prevent it from changing on every render
    const fetchProjects = useCallback(async () => {
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
            console.error('Error fetching projects:', error);
        }
    }, []); // No dependencies, so the function won't change on every render

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]); // Adding fetchProjects as a dependency

    return (
        <div className="relative overflow-x-auto xs:mt-10 sm:rounded-lg pd-1 ">
            < div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 bg-white dark:bg-gray-800" >
                <div className="text-sm font-black text-gray-700 uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-200 px-2 py-3">
                    Recent Projects
                </div >

            </div>
            <table className="min-w-full  divide-y divide-gray-200 leading-normal text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" >
                <thead className="text-base text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400" >
                    <tr>
                        <th scope="col" className="p-2">
                            Id
                        </th>
                        <th scope="col" className="px-4 py-2" >
                            Project Name
                        </th >
                        <th scope="col" className="px-4 py-2" >
                            Due Date
                        </th >
                        <th scope="col" className="px-4 py-2" >
                            Status
                        </th >
                        <th scope="col" className="px-4 py-2" >
                            Action
                        </th >
                    </tr >
                </thead >
                <tbody>
                    {!projects || projects.length === null ? (
                        <tr>
                            <td colSpan="5" className="text-center">---No projects to display---</td>
                        </tr>
                    ) :
                        (projects.slice(0, 3).map((projects, index) => (
                            <tr key={projects.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <td className="w-4 p-4">
                                    {index + 1}
                                </td>
                                <th scope="row" className="flex items-center px-2 py-2 text-gray-900 whitespace-nowrap dark:text-gray-400" >
                                    <div className="ps-3" >
                                        <div className="text-base font-bold capitalize" > {projects.name} </div >
                                    </div >
                                </th >
                                <td className="px-4 py-2" >
                                    <div className="flex items-center" >
                                        {projects.due_date}
                                    </div >
                                </td >
                                <td className="px-4 py-2" >
                                    <div className="flex items-center" >
                                        {projects.status}
                                    </div >
                                </td >
                                <td className="px-6 py-4" >
                                    <div className="flex items-center text-blue-700 hover:underline" >
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

export default DashboardProjects;