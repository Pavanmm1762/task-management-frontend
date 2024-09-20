// Home.js
import React, { useState, useEffect } from 'react';
import {
  FaUserFriends,
  FaTasks,
  FaLayerGroup,
} from "react-icons/fa";
import DashboardProjects from '../components/dashboardProjects';
import DashboardUserChats from '../components/dashboardUserChat';

const Dashboard = () => {
  const [allDetails, setAllDetails] = useState('0');

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL;
      const response1 = await fetch(`${apiUrl}/api/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token} `,
        },
      });

      // Check if the response is successful (status 200)
      if (!response1.ok) {
        throw new Error(`HTTP error! Status: ${response1.status} `);
      }

      // Parse the response as JSON
      const data1 = await response1.json();
      console.log(data1);
      // Set the tasks in the state
      setAllDetails(data1);

    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 s md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5  m-5">
        <div className="rounded-xl border p-5 border-stroke bg-white py-6 px-7.5 shadow-default dark:border-cyan-700 dark:bg-secondary-dark-bg">
          <div className="flex h-10 w-10 items-center justify-center ml-5 rounded-full bg-gray-300 dark:bg-meta-4">
            <FaLayerGroup />

          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold  text-xl text-black dark:text-white">
                {allDetails.total_projects}
              </h4>
              <span className="text-sm text-blue font-medium dark:text-white">Total Projects</span>
            </div>

            <span className="flex items-center gap-1 text-sm font-medium text-meta-3 dark:text-white">

            </span>
          </div>
        </div>

        <div className="rounded-xl border p-5 border-stroke bg-white py-6 px-7.5 shadow-default dark:border-cyan-700  dark:bg-secondary-dark-bg">
          <div className="flex h-10 w-10 items-center justify-center ml-3 rounded-full bg-gray-300 dark:bg-meta-4 ">
            <FaTasks />
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold  text-xl text-black dark:text-white">
                {allDetails.completed_projects}
              </h4>
              <span className="text-sm font-medium dark:text-white">Completed Projects</span>
            </div>

            <span className="flex items-center dark:text-white gap-1 text-sm font-medium text-meta-3">

            </span>
          </div>
        </div>

        <div className="rounded-xl border p-5 border-stroke bg-white py-6 px-7.5 shadow-default dark:border-cyan-700  dark:bg-secondary-dark-bg">
          <div className="flex h-10 w-10 items-center justify-center ml-5 rounded-full bg-gray-300 dark:bg-meta-4">
            <FaUserFriends />
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md text-xl font-bold text-black dark:text-white">
                {allDetails.total_users}
              </h4>
              <span className="text-sm font-medium dark:text-white">Total Users</span>
            </div>

            <span className="flex items-center dark:text-white gap-1 text-sm font-medium text-meta-3">

            </span>
          </div>
        </div>

        <div className="rounded-xl border p-5 border-stroke bg-white py-6 px-7.5 shadow-default dark:border-cyan-700  dark:bg-secondary-dark-bg">
          <div className="flex h-10 w-10 items-center justify-center ml-5 rounded-full bg-gray-300 dark:bg-meta-4 ">
            <FaTasks />
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold  text-xl text-black dark:text-white">
                3
              </h4>
              <span className="text-sm text-cyan font-medium dark:text-white">Total Tasks</span>
            </div>

            <span className="flex items-center gap-1 dark:text-white text-sm font-medium text-meta-3">

            </span>
          </div>
        </div>

      </div >

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-8 p-2 border dark:border-cyan-700 dark:bg-secondary-dark-bg ml-5 mr-5 sm:mr-0 rounded-xl">
          <DashboardProjects />
        </div>
        <DashboardUserChats />
      </div >
    </>
  )
};

export default Dashboard;
