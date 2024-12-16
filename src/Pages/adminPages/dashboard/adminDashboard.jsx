// Home.js
import React, { useState, useEffect } from 'react';
import {
  FaUserFriends,
  FaTasks,
  FaLayerGroup,
} from "react-icons/fa";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  ListBulletIcon,
  UsersIcon,
  QueueListIcon,
  ArrowUpIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/solid";

import DashboardProjects from '../../../components/adminDashboard/dashboardProjects';
import {
  ordersOverviewData
} from "../../../data/orders-overview-data";
import Statistics from '../../../components/adminDashboard/statistics';

const AdminDashboard = () => {
  return (
    <>
      < Statistics />
      < div className="mb-4 ml-5 mr-5 grid grid-cols-1 gap-6 xl:grid-cols-3" >
        <DashboardProjects />
        <Card className="border border-blue-gray-100 shadow-sm dark:border-cyan-700 dark:bg-secondary-dark-bg">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2 dark:text-gray-300">
              Orders Overview
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600 dark:text-gray-500"
            >
              <ArrowUpIcon
                strokeWidth={3}
                className="h-3.5 w-3.5 text-green-500 "
              />
              <strong>24%</strong> this month
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            {ordersOverviewData.map(
              ({ icon, color, title, description }, key) => (
                <div key={title} className="flex items-start gap-4 py-3">
                  <div
                    className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${key === ordersOverviewData.length - 1
                      ? "after:h-0"
                      : "after:h-4/6"
                      }`}
                  >
                    {React.createElement(icon, {
                      className: `!w-5 !h-5 ${color}`,
                    })}
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-medium dark:text-gray-300"
                    >
                      {title}
                    </Typography>
                    <Typography
                      as="span"
                      variant="small"
                      className="text-xs font-medium text-blue-gray-600 dark:text-gray-400"
                    >
                      {description}
                    </Typography>
                  </div>
                </div>
              )
            )}
          </CardBody>
        </Card>
      </div >
    </>
  )
};

export default AdminDashboard;
