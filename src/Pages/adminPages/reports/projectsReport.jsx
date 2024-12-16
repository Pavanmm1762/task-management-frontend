import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
    Input,
    Tooltip,
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
import { fetchProjectsReport, fetchProjectReport } from '../../../services/apiService';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import DownloadButton from '../../../components/reports/DownloadButton';
import { useStateContext } from '../../../contexts/contextProvider';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const apiUrl = process.env.REACT_APP_API_URL;
const token = localStorage.getItem('token');

const fetchAllProjects = async () => {
    let allProjects = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const response = await fetch(`${apiUrl}/api/reports/projects/summaries?page=${page}&limit=100`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const { projects, totalPages } = await response.json();

        allProjects = [...allProjects, ...projects];

        // Check if more pages exist
        if (page >= totalPages) {
            hasMore = false;
        } else {
            page += 1;
        }
    }
    return allProjects;
};

const ProjectReport = () => {
    const navigate = useNavigate();
    const [selectedProject, setSelectedProject] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const pageSize = 5;
    // eslint-disable-next-line no-unused-vars
    const { currentMode, setCurrentMode } = useStateContext();

    const { data: projectsReport, isLoading: isReportLoading, isError: isReportError } = useQuery({
        queryKey: ['projectsReport', currentPage, debouncedSearchTerm],
        queryFn: () => fetchProjectsReport(currentPage, debouncedSearchTerm, pageSize),
        keepPreviousData: true,
        staleTime: 600000,
        cacheTime: 900000,
        refetchOnWindowFocus: false,
        retry: 2,
    });
    const projects = projectsReport?.projects || [];

    // eslint-disable-next-line no-unused-vars
    const { data: projectReport, isLoading, isError } = useQuery({
        queryKey: ['projectReport', selectedProject?.id],
        queryFn: () => fetchProjectReport(selectedProject?.id),
        keepPreviousData: true,
        staleTime: 600000,
        cacheTime: 900000,
        refetchOnWindowFocus: false,
        enabled: !!selectedProject,
        retry: 2,
    });
    const projectDetails = projectReport?.project;
    //const tasks = projectReport?.tasks;
    const users = projectReport?.users;

    const handleRowClick = (project) => {
        setSelectedProject(project);
    };

    const handleBackClick = () => {
        setSelectedProject(false);
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
        const allProjects = await fetchAllProjects(); // Fetch all projects data

        if (allProjects.length === 0) return;

        // Convert data to CSV format
        const csvData = allProjects?.map((project) => ({
            ProjectID: project.id,
            ProjectName: project.name,
            CompletedTasks: project.completed_tasks,
            InProgressTasks: project.in_progress_tasks,
            OverdueTasks: project.overdue_tasks,
        }));

        // Use PapaParse to generate CSV
        const csv = Papa.unparse(csvData);

        // Create Blob and trigger download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'all_projects_report.csv');
    };

    const reportRef = useRef();

    // Handle download logic (e.g., with jsPDF)
    const handleDownload = () => {
        console.log('Downloading report');
        const margin = 5;
        const input = reportRef.current;

        const project = selectedProject?.id || 'projectId';

        // Temporarily hide download button and handle dark mode issues
        const downloadButton = document.querySelector('.no-button');
        downloadButton.style.display = 'none';

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
                pdf.text('Project Report', 105, margin + 10, { align: 'center' });

                // Add the canvas content to the PDF
                pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft > 0) {
                    pdf.addPage();
                    pdf.text('Project Report', 105, margin + 10, { align: 'center' });
                    position = margin;
                    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                // Save the generated PDF
                pdf.save(`${project}_Project_Report.pdf`);

                // Show the download button again
                downloadButton.style.display = 'block';

                input.style.backgroundColor = '';
                input.style.color = '';
            });
        }, 500);
    };


    return (
        <div className="p-1 bg-white dark:bg-secondary-dark-bg">
            {/* If no project is selected, show the project summary table */}
            {!selectedProject ? (
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
                                    Projects Report
                                </Typography>
                            </div>
                            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                                <button onClick={handleDownloadCSV} className="bg-blue-500 text-white font-bold py-1 px-2 rounded">Download CSV</button>
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
                        </div>
                    </CardHeader>
                    <CardBody className="overflow-auto px-0 -p-6">
                        <table className="w-full min-w-max table-auto text-left">
                            <thead className="border-none sticky top-0 z-10" >
                                <tr >
                                    {["Id", "Project Name", "Total Users", "Total Tasks", "Completed Tasks", "Ongoing Tasks", "OverDue Tasks"].map((el, index) => (
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
                                                Error loading prpjects
                                            </Typography>
                                        </td>
                                    </tr>
                                ) : (!projects || projects.length === 0 ? (
                                    <tr className="text-center border-t border-blue-gray-50 dark:border-gray-700">
                                        <td colSpan="6" className="text-center p-3">
                                            <Typography variant="small" className="text-sm py-3 font-medium blue-gray dark:text-gray-300">
                                                No projects to display
                                            </Typography>
                                        </td>
                                    </tr>
                                ) :
                                    (projects?.map(
                                        (project, key) => {
                                            const className = `p-3.5  ${key === projects.length - 1
                                                ? ""
                                                : "border-b border-blue-gray-50 dark:border-gray-700"
                                                } `;

                                            return (
                                                <tr key={project.id} onClick={() => handleRowClick(project)} className='hover:bg-gray-100 dark:hover:bg-gray-700'>
                                                    <td className={`whitespace-nowrap ${className} hidden md:table-cell w-1/12`}>
                                                        <Typography className="text-xs font-semibold capitalize text-gray-500 dark:text-gray-300">
                                                            {project.id.split('-')[0]}-{project.id.split('-')[2]}
                                                        </Typography>
                                                    </td>
                                                    <td className={`${className} whitespace - nowrap`}>
                                                        <div>
                                                            <Link to={`/projects/${project.id}`}>
                                                                <Tooltip content={project.name}
                                                                    className="bg-gray-100 text-gray-600 capitalize dark:bg-gray-700 dark:text-gray-300 max-w-[200px] md:max-w-[250px]">
                                                                    <Typography
                                                                        variant="small"
                                                                        color="blue-gray"
                                                                        className="cursor-pointer text-sm font-bold capitalize text-gray-600 dark:text-gray-200 truncate w-full max-w-[100px] sm:max-w-[150px] lg:max-w-[180px] min-w-0 overflow-hidden hover:text-blue-600 dark:hover:text-blue-600"
                                                                    >
                                                                        {project.name}
                                                                    </Typography>
                                                                </Tooltip>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="text-sm font-bold text-gray-500 dark:text-gray-300"
                                                        >
                                                            {project.total_users}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="text-sm font-bold text-gray-500 dark:text-gray-300"
                                                        >
                                                            {project.total_tasks}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="text-sm font-bold text-gray-500 dark:text-gray-300"
                                                        >
                                                            {project.completed_tasks}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="text-sm font-bold text-gray-500 dark:text-gray-300"
                                                        >
                                                            {project.in_progress_tasks}
                                                        </Typography>
                                                    </td>
                                                    <td className={className}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="text-sm font-bold text-gray-500 dark:text-gray-300"
                                                        >
                                                            {project.overdue_tasks}
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

                        <div className="flex flex-wrap">{renderPagination(projectsReport?.totalPages || 1, currentPage, handlePageChange)}</div>

                        <Button
                            size="sm"
                            variant="text"
                            className="flex items-center gap-2 rounded-full text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                            disabled={!projectsReport?.hasNext || isReportLoading}
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
                                {selectedProject.name}
                                <ArrowTopRightOnSquareIcon
                                    onClick={() => navigate(`/projects/${selectedProject.id}`)}
                                    className='no-print flex items-center justify-center cursor-pointer h-5 w-5 ml-2 mt-.5 text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-500 hover:scale-110 transition-transform' />
                            </h2>
                            <button
                                className="no-button p-1 bg-blue-500 text-white rounded hover:bg-blue-700 h-8 overflow-hidden"
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
                                    <Typography color="gray" className='text-sm font-bold text-gray-700 dark:text-gray-200'>{selectedProject.id}</Typography>
                                </div>
                                <div className="flex mb-2 md:mb-4">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="text-sm font-semibold mr-2 text-gray-700 dark:text-gray-200"
                                    >
                                        Status:
                                    </Typography>
                                    <Typography color="gray" className='text-sm capitalize font-bold text-gray-700 dark:text-gray-200'> {projectDetails?.status}</Typography>
                                </div>
                                <div className='mb-2 md:mb-4'>
                                    <label className="block text-gray-700 text-sm font-semibold mb-1 dark:text-gray-300">Timeline</label>
                                    <div className="flex justify-start items-center">
                                        <Tooltip content="Start date" className="bg-gray-300 text-gray-800 font-semibold dark:bg-gray-600 dark:text-gray-300">
                                            <Typography className="text-xs mr-1 font-bold text-blue-600 dark:text-blue-500">
                                                <CalendarIcon className="h-4 w-4 text-gray-500 dark:text-gray-200" />
                                            </Typography>
                                        </Tooltip>
                                        <span className="text-gray-900 text-sm font-bold dark:text-gray-200">{projectDetails?.start_date || "Not set"}</span>
                                        <ArrowLongRightIcon className='h-5 w-5 mx-2 text-gray-500 dark:text-gray-200' />
                                        <Tooltip content="Due date" className="bg-gray-300 text-gray-800 font-semibold dark:bg-gray-600 dark:text-gray-300">
                                            <Typography className="text-sm mr-1 font-bold text-blue-600 dark:text-blue-500">
                                                <ClockIcon className="h-4 w-4 text-gray-500 dark:text-gray-200" />
                                            </Typography>
                                        </Tooltip>
                                        <span className="text-gray-900 text-sm font-bold dark:text-gray-200">{projectDetails?.due_date || "Not set"}</span>
                                    </div>
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
                                    <Typography color="gray" className='text-sm font-bold text-gray-700 dark:text-gray-200'> {selectedProject?.completed_tasks}</Typography>
                                </div>
                                <div className="flex flex-row mb-2 md:mb-4">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="text-sm font-semibold mr-2 text-gray-700 dark:text-gray-200"
                                    >
                                        In Progress Tasks:
                                    </Typography>
                                    <Typography color="gray" className='text-sm font-bold text-gray-700 dark:text-gray-200'> {selectedProject?.in_progress_tasks}</Typography>
                                </div>
                                <div className="flex flex-row mb-2 md:mb-4">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="text-sm font-semibold mr-2 text-gray-700 dark:text-gray-200"
                                    >
                                        Overdue Tasks:
                                    </Typography>
                                    <Typography color="gray" className='text-sm font-bold text-gray-700 dark:text-gray-200'> {selectedProject.overdue_tasks}</Typography>
                                </div>
                            </div>
                            <div className="mb-2 col-span-2 md:col-span-2">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="text-sm mb-2 font-semibold mr-2 text-gray-700 dark:text-gray-200"
                                >
                                    Team Members:
                                </Typography>
                                <ul className="list-decimal flex ml-4 flex-wrap">
                                    {users?.map((member) => (
                                        <li key={member.id} className='text-sm font-semibold text-gray-600 dark:text-gray-300'>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="text-sm font-semibold mr-6 text-gray-700 dark:text-gray-200"
                                            >
                                                {member.username}
                                            </Typography>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-around items-center flex-wrap">
                            {/* Bar/Pie Chart for Task Completion */}
                            <div className="w-full sm:w-80 md:w-1/2 my-4 md:my-0 p-4">
                                <OverallTasksChart reportData={selectedProject} />
                            </div>

                            {/* Task Progress Graph */}
                            <div className="w-full sm:w-80  md:w-1/2 my-4 p-4">
                                <TaskProgressGraph reportData={selectedProject} />
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

export default ProjectReport;
