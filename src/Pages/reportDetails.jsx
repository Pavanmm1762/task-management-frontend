// ReportDetails.js
import React, { useState, useEffect } from 'react';
import { Progress } from "@material-tailwind/react";

const ReportDetails = () => {
    const [reportDetails, setReportDetails] = useState(null);

    useEffect(() => {
        fetchReportDetails();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const fetchReportDetails = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:8080/api/report-lists', {
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
            setReportDetails(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    return (
        <div className="relative overflow-x-auto  sm:rounded-lg  pl-10 pr-5 pd-1 ">
            < div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-white dark:bg-gray-900" >
                <div className="text-2xl font-black text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 px-6 py-3">
                    Report Details
                </div >
                <label for="table-search" className="sr-only" > Search</label >
                <div className="relative" >
                    <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none" >
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" >
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg >
                    </div >
                    <input type="text" id="table-search-users" className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for users" />
                </div >
            </div >

            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400" >
                <thead className="text-base text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400" >
                    <tr>
                        <th scope="col" className="p-4">
                            Id
                        </th>
                        <th scope="col" className="px-6 py-3" >
                            Project Name
                        </th >
                        <th scope="col" className="px-6 py-3" >
                            Total Tasks
                        </th >
                        <th scope="col" className="px-6 py-3" >
                            Completed Tasks
                        </th >
                        <th scope="col" className="px-6 py-3" >
                            Progress
                        </th >
                        <th scope="col" className="px-6 py-3" >
                            Status
                        </th >
                    </tr >
                </thead >
                <tbody>
                    {!reportDetails || reportDetails.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center">No Reports to display</td>
                        </tr>
                    ) :
                        (reportDetails.map((reportDetails, index) => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="w-4 p-4">
                                    {index + 1}
                                </td>
                                <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white" >
                                    <div className="ps-3" >
                                        <div className="text-base font-bold capitalize" > {reportDetails.project_name}  </div >
                                        <div className="font-normal text-gray-500" >  </div >
                                    </div >
                                </th >
                                <td className="px-6 py-4" >
                                    {reportDetails.total_tasks}
                                </td >
                                <td className="px-6 py-4" >
                                    <div className="flex items-center" >
                                        {reportDetails.completed_tasks}
                                    </div >
                                </td >
                                <td className="px-6 py-4" >
                                    <div className="flex items-center bg:bg-blue-gray-50" >
                                        <Progress value={reportDetails.progress} label={reportDetails.progress} color="cyan" />

                                    </div >
                                </td >
                                <td className="px-6 py-4" >
                                    <div className="flex items-center " >
                                        {reportDetails.status}
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

export default ReportDetails;
