import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Avatar,
    Chip,
    Button,
    IconButton,
    Input,
    Tooltip,
    Progress,
} from "@material-tailwind/react";
import { useDebounce } from 'use-debounce';
import {
    CalendarIcon, ClockIcon,
    ArrowLongRightIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { ArrowRightIcon, ArrowLeftIcon, ArrowTopRightOnSquareIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { renderPagination } from '../../../components/pagination';
import OverallTasksChart from '../../../components/reports/OverallTasksChart';
import TaskProgressGraph from '../../../components/reports/TaskProgressGraph';
import { fetchUsersReport, fetchUserReport } from '../../../services/apiService';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import DownloadButton from '../../../components/reports/DownloadButton';
import { useStateContext } from '../../../contexts/contextProvider';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const apiUrl = process.env.REACT_APP_API_URL;
const token = localStorage.getItem('token');

const fetchAllUsers = async () => {
    let allUsers = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const response = await fetch(`${apiUrl}/api/reports/users/summaries?page=${page}&limit=100`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const { users, totalPages } = await response.json();

        allUsers = [...allUsers, ...users];

        // Check if more pages exist
        if (page >= totalPages) {
            hasMore = false;
        } else {
            page += 1;
        }
    }
    return allUsers;
};

const UsersReport = () => {
    const [selectedUser, setSelectedUser] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const pageSize = 5;
    const { currentMode, setCurrentMode } = useStateContext();

    const { data: usersReport, isLoading: isReportLoading, isError: isReportError } = useQuery({
        queryKey: ['usersReport', currentPage, debouncedSearchTerm],
        queryFn: () => fetchUsersReport(currentPage, debouncedSearchTerm, pageSize),
        keepPreviousData: true,
        staleTime: 600000,
        cacheTime: 900000,
        refetchOnWindowFocus: false,
        retry: 2,
    });
    const users = usersReport?.users || [];

    const { data: userReport, isLoading, isError } = useQuery({
        queryKey: ['userReport', selectedUser?.id],
        queryFn: () => fetchUserReport(selectedUser?.id),
        keepPreviousData: true,
        staleTime: 600000,
        cacheTime: 900000,
        refetchOnWindowFocus: false,
        enabled: !!selectedUser,
        retry: 2,
    });
    const tasks = userReport?.task_completion_data;

    const handleRowClick = (user) => {
        setSelectedUser(user);
    };

    const handleBackClick = () => {
        setSelectedUser(false);
    };

    // Handle specific page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    };

    const handleDownloadCSV = async () => {
        const allUsers = await fetchAllUsers(); // Fetch all projects data

        if (allUsers.length === 0) return;

        // Convert data to CSV format
        const csvData = allUsers?.map((user) => ({
            UserID: user.id,
            FullName: user.full_name,
            UserName: user.username,
            CompletedTasks: user.completed_tasks,
            InProgressTasks: user.in_progress_tasks,
            OverdueTasks: user.overdue_tasks,
        }));

        // Use PapaParse to generate CSV
        const csv = Papa.unparse(csvData);

        // Create Blob and trigger download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'all_users_report.csv');
    };

    const reportRef = useRef();

    // Handle download logic (e.g., with jsPDF)
    const handleDownload = () => {
        console.log('Downloading report');
        const margin = 5;
        const input = reportRef.current;

        const username = selectedUser?.username || 'report';

        // Temporarily hide download button and handle dark mode issues
        const downloadButton = document.querySelector('.no-print');
        downloadButton.style.display = 'none'; // Hide download button

        // Check if the document is in dark mode
        const isDarkMode = currentMode === 'dark' ? true : false;
        const bgColor = isDarkMode ? '#33373E' : '#fff';
        const textColor = isDarkMode ? '#fff' : '#000';

        // Apply background and text color changes to the report content
        input.style.backgroundColor = bgColor;
        input.style.color = textColor;

        // Delay PDF generation slightly to ensure the DOM updates
        setTimeout(() => {
            html2canvas(input, { scale: 2, backgroundColor: bgColor }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');

                const imgWidth = 210 - 2 * margin;
                const pageHeight = 295 - 2 * margin;

                const imgHeight = canvas.height * imgWidth / canvas.width;
                let heightLeft = imgHeight;
                let position = margin + 15;

                // Add title to the first page
                pdf.setFontSize(18);
                pdf.text('User Report', 105, margin + 10, { align: 'center' });

                // Add the canvas content to the PDF
                pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft > 0) {
                    pdf.addPage();
                    pdf.text('User Report', 105, margin + 10, { align: 'center' });
                    position = margin;
                    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                // Save the generated PDF
                pdf.save(`${username}_Report.pdf`);

                // Show the download button again
                downloadButton.style.display = 'block';

                input.style.backgroundColor = '';
                input.style.color = '';
            });
        }, 500);
    };


    return (
        <div className="p-0 bg-white dark:bg-secondary-dark-bg">
            {/* If no project is selected, show the project summary table */}
            {!selectedUser ? (
                <Card className="h-full w-full bg-white dark:bg-secondary-dark-bg shadow-none m-0 p-0">
                    <CardHeader
                        floated={false}
                        shadow={false}
                        color='transparent'
                        className="rounded-none bg-white z-20 mx-0 mt-0 mb-1 bg-white dark:bg-secondary-dark-bg border-b border-blue-gray-50 dark:border-gray-700"
                    >
                        <div className="mb-2 flex items-center justify-between gap-8">
                            <div>
                                <Typography variant="h5" color="blue-gray" className="blue-gray dark:text-gray-300">
                                    Users Report
                                </Typography>
                            </div>
                            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                                <button onClick={handleDownloadCSV} className="bg-blue-500 text-white font-bold py-1 px-2 rounded">Download CSV</button>
                                <div className="w-full md:w-72">
                                    <Input
                                        type="search"
                                        placeholder="search with username"
                                        className="!border !border-gray-300 bg-white text-gray-900 dark:!border-gray-600 dark:text-gray-300 placeholder:text-gray-500 placeholder:opacity-100 focus:border-gray-900 focus:ring-gray-900/10 dark:focus:border-gray-400 dark:focus:ring-gray-400/10 dark:placeholder:text-gray-400 dark:bg-secondary-dark-bg"
                                        icon={<MagnifyingGlassIcon className="h-5 w-5 dark:text-gray-400" />}
                                        labelProps={{
                                            className: "hidden",
                                        }}
                                        value={searchTerm}
                                        onChange={handleSearchChange} />
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="overflow-auto px-0 -p-6">
                        <table className="w-full min-w-max table-auto text-left">
                            <thead className="border-none sticky top-0 z-10" >
                                <tr >
                                    {["Id", "Name", "Role", "Completed Tasks", "Ongoing Tasks", "OverDue Tasks"].map((el, index) => (
                                        <th
                                            key={el}
                                            className={`bg-gray-100 p-4 transition-colors dark:bg-gray-700 dark:border-gray-700 
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
                                {isReportLoading ? (
                                    // Skeleton rows for loading state
                                    Array(5).fill().map((_, index) => (
                                        <tr key={index}>
                                            <td className="px-2 py-2" colSpan={6}><Skeleton height={45} /></td >
                                        </tr>
                                    ))
                                ) : isReportError ? (
                                    <tr className="text-center border-t border-blue-gray-50 dark:border-gray-700">
                                        <td colSpan="6" className="text-center p-3">
                                            <Typography variant="small" className="text-sm py-3 font-medium blue-gray dark:text-gray-300">
                                                Error loading users
                                            </Typography>
                                        </td>
                                    </tr>
                                ) : (!users || users.length === 0 ? (
                                    <tr className="text-center border-t border-blue-gray-50 dark:border-gray-700">
                                        <td colSpan="6" className="text-center p-3">
                                            <Typography variant="small" className="text-sm py-3 font-medium blue-gray dark:text-gray-300">
                                                No users to display
                                            </Typography>
                                        </td>
                                    </tr>
                                ) :
                                    (users?.map(
                                        (user, key) => {
                                            const className = `p-3.5  ${key === users.length - 1
                                                ? ""
                                                : "border-b border-blue-gray-50 dark:border-gray-700"
                                                } `;

                                            return (
                                                <tr key={user.id} onClick={() => handleRowClick(user)} className='hover:bg-gray-100 dark:hover:bg-gray-700'>
                                                    <td className={`whitespace-nowrap ${className} hidden md:table-cell w-1/12`}>
                                                        <Typography className="text-xs font-semibold capitalize text-gray-500 dark:text-gray-300">
                                                            {user.id.split('-')[0]}-{user.id.split('-')[2]}
                                                        </Typography>
                                                    </td>
                                                    <td className={`${className} whitespace - nowrap`}>
                                                        <div>
                                                            <Link to={`/users/${user.id}`}>
                                                                <Typography
                                                                    variant="small"
                                                                    color="blue-gray"
                                                                    className="cursor-pointer text-sm font-bold capitalize text-gray-600 dark:text-gray-200 truncate w-full max-w-[100px] sm:max-w-[150px] lg:max-w-[180px] min-w-0 overflow-hidden hover:text-blue-600 dark:hover:text-blue-600"
                                                                >
                                                                    {user.full_name}
                                                                </Typography>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="text-sm font-bold capitalize text-gray-500 dark:text-gray-300"
                                                        >
                                                            {user.role}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="text-sm font-bold text-gray-500 dark:text-gray-300"
                                                        >
                                                            {user.completed_tasks}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="text-sm font-bold text-gray-500 dark:text-gray-300"
                                                        >
                                                            {user.in_progress_tasks}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="text-sm font-bold text-gray-500 dark:text-gray-300"
                                                        >
                                                            {user.overdue_tasks}
                                                        </Typography>
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
                            disabled={currentPage === 1 || isReportLoading}
                            onClick={() => setCurrentPage(prevPage => prevPage - 1)}
                        >
                            <ArrowLeftIcon strokeWidth={2} className="h-3 w-3 text-gray-600 dark:text-gray-200" />Previous
                        </Button>

                        <div className="flex flex-wrap">{renderPagination(usersReport?.totalPages || 1, currentPage, handlePageChange)}</div>

                        <Button
                            size="sm"
                            variant="text"
                            className="flex items-center gap-2 rounded-full text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                            disabled={!usersReport?.hasNext || isReportLoading}
                            onClick={() => setCurrentPage(prevPage => prevPage + 1)}
                        >
                            Next
                            <ArrowRightIcon strokeWidth={2} className="h-3 w-3 text-gray-600 dark:text-gray-200" />
                        </Button>
                    </CardFooter>
                </Card >
            ) : (
                // If a project is selected, show the project detail view
                <div className="mt-0">
                    <div ref={reportRef} className='px-2'>
                        <div className="mb-2 flex items-top justify-between gap-8">
                            <h2 className="flex text-2xl items-center capitalize font-bold dark:text-white">
                                {selectedUser.full_name}
                                <Link to={`/projects/${selectedUser.id}`}>
                                    <ArrowTopRightOnSquareIcon className='no-print cursor-pointer h-5 w-5 ml-2 mt-.5 text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-500 hover:scale-110 transition-transform' />
                                </Link>
                            </h2>
                            <button
                                className="no-print p-1 bg-blue-500 text-white rounded hover:bg-blue-700 h-8 md:h-10"
                                onClick={handleBackClick}
                            >
                                Back to Summary
                            </button>
                        </div>

                        <div className="md:grid md:grid-cols-2 gap-2 ml-2">
                            <div className="mb-2 md:mb-0">
                                <div className="flex mb-2 md:mb-4">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="text-sm font-semibold mr-2 text-gray-700 dark:text-gray-200"
                                    >
                                        ID:
                                    </Typography>
                                    <Typography color="gray" className='text-sm font-bold text-gray-700 dark:text-gray-200'>{selectedUser.id}</Typography>
                                </div>
                                <div className="flex mb-2 md:mb-4">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="text-sm font-semibold mr-2 text-gray-700 dark:text-gray-200"
                                    >
                                        Username:
                                    </Typography>
                                    <Typography color="gray" className='text-sm capitalize font-bold text-gray-700 dark:text-gray-200'> {selectedUser?.username}</Typography>
                                </div>
                                <div className="flex mb-2 md:mb-4">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="text-sm font-semibold mr-2 text-gray-700 dark:text-gray-200"
                                    >
                                        Status:
                                    </Typography>
                                    <Typography color="gray" className='text-sm capitalize font-bold text-gray-700 dark:text-gray-200'> {userReport?.status}</Typography>
                                </div>
                            </div>
                            <div className="mb-2 md:mb-0">
                                <div className='flex flex-row mb-2 md:mb-4'>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="text-sm font-semibold mr-2 text-gray-700 dark:text-gray-200"
                                    >
                                        Completed Tasks:
                                    </Typography>
                                    <Typography color="gray" className='text-sm font-bold text-gray-700 dark:text-gray-200'> {selectedUser?.completed_tasks}</Typography>
                                </div>
                                <div className="flex flex-row mb-2 md:mb-4">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="text-sm font-semibold mr-2 text-gray-700 dark:text-gray-200"
                                    >
                                        In Progress Tasks:
                                    </Typography>
                                    <Typography color="gray" className='text-sm font-bold text-gray-700 dark:text-gray-200'> {selectedUser?.in_progress_tasks}</Typography>
                                </div>
                                <div className="flex flex-row">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="text-sm font-semibold mr-2 text-gray-700 dark:text-gray-200"
                                    >
                                        Overdue Tasks:
                                    </Typography>
                                    <Typography color="gray" className='text-sm font-bold text-gray-700 dark:text-gray-200'> {selectedUser?.overdue_tasks}</Typography>
                                </div>
                            </div>
                            <div className="mb-2 col-span-2 md:col-span-2">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="text-sm mb-2 font-semibold mr-2 text-gray-700 dark:text-gray-200"
                                >
                                    Tasks Assigned:
                                </Typography>
                                <ul className="list-decimal flex ml-4 flex-wrap">
                                    {tasks?.map((task) => (
                                        <li key={task.id} className='text-sm font-semibold text-gray-600 dark:text-gray-300'>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="text-sm font-semibold mr-6 text-gray-700 dark:text-gray-200"
                                            >
                                                {task.id}
                                            </Typography>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-around items-center flex-wrap">
                            {/* Bar/Pie Chart for Task Completion */}
                            <div className="w-full sm:w-80 md:w-1/2 my-4 md:my-0 p-4">
                                <OverallTasksChart reportData={selectedUser} />
                            </div>

                            {/* Task Progress Graph */}
                            <div className="w-full sm:w-80  md:w-1/2 my-4 p-4">
                                <TaskProgressGraph reportData={selectedUser} />
                            </div>
                        </div>
                    </div>

                    {/* Download Button */}
                    <div className='flex justify-end item-end'>
                        <DownloadButton onDownload={handleDownload} />
                    </div>
                </div >
            )
            }
        </div >
    );
};

export default UsersReport;
