import React from 'react';
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
} from "@material-tailwind/react";
import {
    EllipsisVerticalIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '../../services/apiService';

const DashboardProjects = () => {
    const limit = 5;
    const { data, isLoading, isError } = useQuery({
        queryKey: ['recentProjects', limit],
        queryFn: () => fetchProjects(1),
        keepPreviousData: true,
    });

    return (
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 dark:border-gray-700 shadow-sm dark:bg-secondary-dark-bg">
            <CardHeader
                floated={false}
                shadow={false}
                color="transparent"
                className="m-0 flex items-center justify-between p-6"
            >
                <div>
                    <Typography variant="h6" className="mb-1 blue-gray dark:text-gray-300">
                        Projects
                    </Typography>
                    <Typography
                        variant="small"
                        className="flex items-center gap-1 font-normal text-blue-gray-600 dark:text-gray-400"
                    >
                        <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                        <strong>30 done</strong> this month
                    </Typography>
                </div>
                <Menu placement="left-start">
                    <MenuHandler>
                        <IconButton size="sm" variant="text" color="blue-gray" className="blue-gray dark:text-gray-300">
                            <EllipsisVerticalIcon
                                strokeWidth={3}
                                fill="currenColor"
                                className="h-6 w-6"
                            />
                        </IconButton>
                    </MenuHandler>
                    <MenuList className="dark:bg-secondary-dark-bg dark:text-gray-300 border-none">
                        <MenuItem>Action</MenuItem>
                        <MenuItem>Another Action</MenuItem>
                        <MenuItem>Something else here</MenuItem>
                    </MenuList>
                </Menu>
            </CardHeader>
            <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
                <table className="w-full min-w-[640px] table-auto">
                    <thead>
                        <tr>
                            {["Id", "Project Name", "Due Date", "Status", "Action"].map((el) => (
                                <th key={el} className="py-3 px-6 text-left">
                                    <Typography
                                        variant="small"
                                        className="text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400"
                                    >
                                        <strong>{el}</strong>
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            Array(5).fill().map((_, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2" colSpan={5}><Skeleton height={30} /></td>
                                </tr>
                            ))
                        ) : isError ? (
                            <tr className="text-center border-t border-blue-gray-50 dark:border-gray-700">
                                <td colSpan="5" className="text-center p-3">
                                    <Typography variant="small" className="text-sm font-medium blue-gray dark:text-gray-300">
                                        Error loading projects
                                    </Typography>
                                </td>
                            </tr>
                        ) : (
                            data?.projects.length === 0 ? (
                                <tr className="text-center border-t border-blue-gray-50 dark:border-gray-700">
                                    <td colSpan="5" className="text-center p-3">
                                        <Typography variant="small" className="text-sm font-medium blue-gray dark:text-gray-300">
                                            No projects to display
                                        </Typography>
                                    </td>
                                </tr>
                            ) : (
                                data?.projects.map((project, index) => (
                                    <tr key={project.id} className="border-t border-blue-gray-50 dark:border-gray-700">
                                        <td className="py-3 px-5">
                                            <Typography
                                                variant="small"
                                                className="font-medium capitalize blue-gray dark:text-gray-300"
                                            >
                                                {index + 1}
                                            </Typography>
                                        </td>
                                        <td className="py-3 px-5">
                                            <Typography
                                                variant="small"
                                                className="font-bold capitalize blue-gray dark:text-gray-300 truncate w-full max-w-[100px] sm:max-w-[150px] lg:max-w-[180px] min-w-0 overflow-hidden"
                                            >
                                                {project.name}
                                            </Typography>
                                        </td>
                                        <td className="px-4 py-2">
                                            <Typography
                                                variant="small"
                                                className="text-xs font-medium text-blue-gray-600 dark:text-gray-400"
                                            >
                                                {project.due_date}
                                            </Typography>
                                        </td>
                                        <td className="px-4 py-2">
                                            <Typography
                                                variant="small"
                                                className="text-xs font-medium capitalize text-blue-gray-600 dark:text-gray-400"
                                            >
                                                {project.status}
                                            </Typography>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link to={`/projects/${project.id}`}>
                                                <Typography
                                                    className="text-xs font-normal text-blue-600 dark:text-blue-500"
                                                >
                                                    view
                                                </Typography>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )
                        )}
                    </tbody>
                </table>
            </CardBody>
        </Card>
    );
};

export default DashboardProjects;
