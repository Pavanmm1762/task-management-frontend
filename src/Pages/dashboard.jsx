// Home.js
import React, { useState, useEffect } from 'react';
import {
  FaTh,
  FaBars,
  FaUserFriends,
  FaTasks,
  FaLayerGroup,
  FaThList
} from "react-icons/fa";


const Dashboard = () => {
  const [allDetails, setAllDetails] = useState('0');

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:8080/api/dashboard', {
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
      setAllDetails(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 s md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5  m-10">
        <div className="rounded-sm border p-5 border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-10 w-10 items-center justify-center ml-5 rounded-full bg-gray-300 dark:bg-meta-4">
            <FaLayerGroup />

          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {allDetails.total_projects}
              </h4>
              <span className="text-sm text-blue font-medium">Total Projects</span>
            </div>

            <span className="flex items-center gap-1 text-sm font-medium text-meta-3">
              0.43%
            </span>
          </div>
        </div>

        <div className="rounded-sm border p-5 border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-10 w-10 items-center justify-center ml-5 rounded-full bg-gray-300 dark:bg-meta-4 ">
            <FaTasks />
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {allDetails.completed_projects}
              </h4>
              <span className="text-sm font-medium">Completed Projects</span>
            </div>

            <span className="flex items-center gap-1 text-sm font-medium text-meta-3">
              4.35%
            </span>
          </div>
        </div>

        <div className="rounded-sm border p-5 border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-10 w-10 items-center justify-center ml-5 rounded-full bg-gray-300 dark:bg-meta-4">
            <FaUserFriends />
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {allDetails.total_users}
              </h4>
              <span className="text-sm font-medium">Total Users</span>
            </div>

            <span className="flex items-center gap-1 text-sm font-medium text-meta-3">
              4.35%
            </span>
          </div>
        </div>

        <div className="rounded-sm border p-5 border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-10 w-10 items-center justify-center ml-5 rounded-full bg-gray-300 dark:bg-meta-4 ">
            <FaTasks />
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                $45,2K
              </h4>
              <span className="text-sm text-cyan font-medium">Completed Projects</span>
            </div>

            <span className="flex items-center gap-1 text-sm font-medium text-meta-3">
              4.35%
            </span>
          </div>
        </div>

      </div >

      {/* <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        < ChartOne />
        <ChartTwo />
        <ChartThree />
        <MapOne />
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChatCard />
      </div > */}
    </>
  )
};

export default Dashboard;
