import React from 'react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Avatar,
    Chip,
    Button,
    Input,
    Tooltip,
} from "@material-tailwind/react";
import { useDebounce } from 'use-debounce';
import {
    CheckCircleIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { ArrowRightIcon, ArrowLeftIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { renderPagination } from '../../../components/pagination';
import { fetchProjects } from '../../../services/apiService';

const ProjectList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const pageSize = 5;
    const maxVisibleAvatars = 5;

    // React Query to fetch projects, triggered by debouncedSearchTerm and page change
    const { data: projectsList, isLoading, isError } = useQuery({
        queryKey: ['projects', currentPage, debouncedSearchTerm],
        queryFn: () => fetchProjects(currentPage, debouncedSearchTerm, pageSize),
        keepPreviousData: true,
        staleTime: 600000, // 10 minutes
        cacheTime: 900000, // 15 minutes
        refetchOnWindowFocus: false,
        retry: 2,
    });

    // Handle specific page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
        // fetchProjects(1);

    };

    return (
        <div className="m-0 lg:mr-1 md:mr-1 md:ml-1">
            <Card className="h-full w-full bg-white dark:bg-secondary-dark-bg">
                <CardHeader
                    floated={false}
                    shadow={false}
                    color='transparent'
                    className="rounded-none sticky bg-white top-[68px] z-20 p-3.5 mx-0 mt-0 mb-1 bg-white dark:bg-secondary-dark-bg border-b border-blue-gray-50 dark:border-gray-700"
                >
                    <div className="mb-2 flex items-center justify-between gap-8">
                        <div>
                            <Typography variant="h5" color="blue-gray" className="blue-gray dark:text-gray-300">
                                Projects Overview
                            </Typography>
                            <Typography
                                //variant="small"
                                className="flex items-center gap-1 font-normal text-blue-gray-600 dark:text-gray-400 mt-1"
                            >
                                <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                                <strong>30 done</strong> this month
                            </Typography>
                        </div>
                        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                            <Link to="/task_management/create-project" className="relative group ">
                                <Button
                                    variant="filled"
                                    className="flex items-center gap-1"
                                >
                                    Add Project
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-end gap-4 md:flex-row">
                        <div className="w-full md:w-72">
                            <Input
                                type="search"
                                placeholder="search with project name"
                                className="!border !border-gray-300 bg-white text-gray-900 dark:!border-gray-600 dark:text-gray-300 placeholder:text-gray-500 placeholder:opacity-100 focus:border-gray-900 focus:ring-gray-900/10 dark:focus:border-gray-400 dark:focus:ring-gray-400/10 dark:placeholder:text-gray-400 dark:bg-secondary-dark-bg"
                                icon={<MagnifyingGlassIcon className="h-5 w-5 dark:text-gray-400" />}
                                labelProps={{
                                    className: "hidden",
                                }}
                                value={searchTerm}
                                onChange={handleSearchChange} />
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="overflow-auto px-0 -p-6 ml-4 mr-4">
                    <table className="w-full min-w-max table-auto text-left">
                        <thead className="border-none sticky top-0 z-10" >
                            <tr>
                                {["Id", "Project Name", "Timeline", "Members", "Status", "Priority", ""].map((el, index) => (
                                    <th
                                        key={el}
                                        className={`bg-gray-100 p-3 transition-colors dark:bg-gray-700 dark:border-gray-700 
                                      ${el === "Id" ? 'hidden md:table-cell' : ''}`}
                                    >
                                        <Typography
                                            variant="small"
                                            className="text-xs flex items-center justify-between gap-2 font-bold uppercase text-gray-500 dark:text-gray-400 leading-none opacity-90"
                                        >
                                            {el}{" "}
                                            {index !== 5 && (
                                                <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4 cursor-pointer" />
                                            )}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                // Skeleton rows for loading state
                                Array(5).fill().map((_, index) => (
                                    <tr key={index}>
                                        <td className="px-2 py-2" colSpan={6}><Skeleton height={45} /></td >
                                    </tr>
                                ))
                            ) : isError ? (
                                <tr className="text-center border-t border-blue-gray-50 dark:border-gray-700">
                                    <td colSpan="6" className="text-center p-3">
                                        <Typography variant="small" className="text-sm py-3 font-medium blue-gray dark:text-gray-300">
                                            Error loading prpjects
                                        </Typography>
                                    </td>
                                </tr>
                            ) : (!projectsList?.projects || projectsList?.projects.length === 0 ? (
                                <tr className="text-center border-t border-blue-gray-50 dark:border-gray-700">
                                    <td colSpan="6" className="text-center p-3">
                                        <Typography variant="small" className="text-sm py-3 font-medium blue-gray dark:text-gray-300">
                                            No projects to display
                                        </Typography>
                                    </td>
                                </tr>
                            ) :
                                (projectsList?.projects.map(
                                    ({ id, name, description, start_date, due_date, status, priority, user_names }, key) => {
                                        const className = `p-3.5  ${key === projectsList?.projects.length - 1
                                            ? ""
                                            : "border-b border-blue-gray-50 dark:border-gray-700"
                                            } `;

                                        return (
                                            <tr key={id} >
                                                <td className={`whitespace-nowrap ${className} hidden md:table-cell w-1/12`}>
                                                    <Typography className="text-xs font-semibold capitalize text-gray-500 dark:text-gray-300">
                                                        {id.split('-')[0]}-{id.split('-')[2]}
                                                    </Typography>
                                                </td>
                                                <td className={`${className} whitespace - nowrap`}>
                                                    <div>
                                                        <Tooltip content={name}
                                                            className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 max-w-[200px] md:max-w-[250px]">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="text-sm font-bold capitalize text-gray-600 dark:text-gray-200 truncate w-full max-w-[100px] sm:max-w-[150px] lg:max-w-[180px] min-w-0 overflow-hidden"
                                                            >
                                                                {name}
                                                            </Typography>
                                                        </Tooltip>
                                                        <Typography
                                                            className="text-xs font-semibold text-gray-800 dark:text-gray-300 opacity-70 truncate w-full max-w-[100px] sm:max-w-[150px] lg:max-w-[180px] min-w-0 overflow-hidden">
                                                            {description.charAt(0).toUpperCase() + description.slice(1)}
                                                        </Typography>
                                                    </div>
                                                </td>
                                                <td className={className}>
                                                    <div className="flex flex-col">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="text-xs font-bold text-gray-500 dark:text-gray-300"
                                                        >
                                                            {due_date}
                                                        </Typography>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="text-xs font-semibold text-gray-500 dark:text-gray-300 opacity-70"
                                                        >
                                                            {start_date}
                                                        </Typography>
                                                    </div>
                                                </td>
                                                <td className={className}>
                                                    <div className="flex items-center -space-x-4">
                                                        {user_names?.length > 0 ? (
                                                            <>
                                                                {user_names.slice(0, maxVisibleAvatars).map((user, index) => (
                                                                    <Avatar
                                                                        key={index}
                                                                        variant="circular"
                                                                        alt={user.name}
                                                                        className="h-8 w-8 border-2 border-white dark:border-gray-400 hover:z-20 focus:z-10"
                                                                        src="https://docs.material-tailwind.com/img/face-2.jpg"
                                                                    />
                                                                ))}
                                                                {user_names.length > maxVisibleAvatars && (
                                                                    <div className="flex items-center justify-center w-8 h-8 border-2 border-white dark:border-gray-400 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-700 z-10">
                                                                        <Typography className="text-xs font-semibold text-gray-500 capitalize dark:text-gray-200">
                                                                            +{user_names.length - maxVisibleAvatars}
                                                                        </Typography>
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <Typography className="text-xs font-semibold text-gray-500 capitalize dark:text-gray-300">
                                                                Not assigned
                                                            </Typography>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className={className}>
                                                    <div className="w-max">
                                                        <Chip
                                                            variant="ghost"
                                                            size="sm"
                                                            value={status}
                                                            color={
                                                                status === 'completed' ? 'green' :
                                                                    status === 'pending' ? 'yellow' :
                                                                        status === 'overdue' ? 'red' :
                                                                            'gray'
                                                            }
                                                            className="dark:text-gray-300"
                                                        />
                                                    </div>
                                                </td>
                                                <td className={className}>
                                                    <div className="w-max">
                                                        <Chip
                                                            variant="ghost"
                                                            size="sm"
                                                            value={priority}
                                                            color={
                                                                priority === 'high' ? 'red' :
                                                                    priority === 'medium' ? 'yellow' :
                                                                        priority === 'low' ? 'green' :
                                                                            'gray'
                                                            }
                                                            className="dark:text-gray-300"
                                                        />
                                                    </div>
                                                </td>
                                                <td className={className}>
                                                    <Link to={`/projects/${id}`}>
                                                        <Typography
                                                            className="text-xs font-normal text-blue-600 dark:text-blue-500"
                                                        >
                                                            view
                                                        </Typography>
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )
                                ))
                            }
                        </tbody>
                    </table>
                </CardBody>
                <CardFooter className="flex justify-end items-center py-3 flex-wrap gap-2 border-t border-blue-gray-50 dark:border-gray-700">
                    <Button
                        size="sm"
                        variant="text"
                        className="flex items-center gap-2 rounded-full text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                        disabled={currentPage === 1 || isLoading}
                        onClick={() => setCurrentPage(prevPage => prevPage - 1)}
                    >
                        <ArrowLeftIcon strokeWidth={2} className="h-3 w-3 text-gray-600 dark:text-gray-200" />Previous
                    </Button>

                    <div className="flex flex-wrap">{renderPagination(projectsList?.totalPages || 1, currentPage, handlePageChange)}</div>

                    <Button
                        size="sm"
                        variant="text"
                        className="flex items-center gap-2 rounded-full text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                        disabled={!projectsList?.hasNext || isLoading}
                        onClick={() => setCurrentPage(prevPage => prevPage + 1)}
                    >
                        Next
                        <ArrowRightIcon strokeWidth={2} className="h-3 w-3 text-gray-600 dark:text-gray-200" />
                    </Button>
                </CardFooter>
            </Card >
        </div >
    );

};

export default ProjectList;