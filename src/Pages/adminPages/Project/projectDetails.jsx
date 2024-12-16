// ProjectDetails.js

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Skeleton from 'react-loading-skeleton';
import { CalendarIcon, ClockIcon, ArrowLongRightIcon } from "@heroicons/react/24/solid";
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from 'react-toastify';
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import {
    Chip,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Input,
    IconButton,
    Typography,
    Tooltip,
} from "@material-tailwind/react";

import { useDebounce } from 'use-debounce';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
    fetchProject, addTask, updateProject, deleteProject, fetchAssociatedUsers, updateProjectMembers,
    updateTask, deleteTask,
} from '../../../services/apiService';
import AddTeamMembersModal from '../../../components/AddTeamMembersModal';
import { DeleteModal } from '../../../components/deleteModal';
import ProjectTasksList from '../../../components/projectDetails/projectTasks';
import TeamMembers from '../../../components/projectDetails/teamMembers';

const baseProjectSchema = z.object({
    name: z.string()
        .min(1, { message: "Project name is required" })
        .min(2, { message: "Project name must be at least 2 characters" }),

    description: z.string()
        .min(1, { message: "Description is required" })
        .min(5, { message: "Description must be at least 5 characters" }),

    startDate: z.string()
        .min(1, { message: "Start date is required" })
        .refine((val) => !isNaN(Date.parse(val)), { message: "Start date must be a valid date" }),

    dueDate: z.string()
        .min(1, { message: "Due date is required" })
        .refine((val) => !isNaN(Date.parse(val)), { message: "Due date must be a valid date" }),
});

// Full schema with refine for final form submission validation
const projectSchema = baseProjectSchema.refine((data) => new Date(data.dueDate) > new Date(data.startDate), {
    message: "Due date must be after the start date",
    path: ["dueDate"],
});

const ProjectDetails = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [showEditModal, setEditShowModal] = useState(null);
    const [showDeleteModal, setDeleteModal] = useState({
        isOpen: false,
        name: '',
        id: null,
        type: "Project",
    });
    const [projectData, setProjectData] = useState({
        name: '',
        description: '',
        startDate: '',
        dueDate: "",
        priority: 'medium',
        status: 'not started',
    });
    const [showModal, setShowModal] = useState(false);
    const [selectedMembers, setselectedMembers] = useState([]);
    const departments = [
        { id: 'it', name: 'IT' },
        { id: 'marketing', name: 'Marketing' },
        { id: 'finance', name: 'Finance' }
    ];
    const [remainingTime, setRemainingTime] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [formErrors, setFormErrors] = useState({});

    const { projectId } = useParams();

    // Fetch Project data with caching and stale time settings
    const { data: project, isLoading: isProjectLoading, isError: isProjectError } = useQuery({
        queryKey: ['project', projectId],
        queryFn: () => fetchProject(projectId),
        staleTime: 600000, // 10 minutes
        cacheTime: 900000, // 15 minutes
        refetchOnWindowFocus: false,
        retry: 2,
    });

    // Fetch members data
    const { data: members, isLoading: isMemberLoading, isError: isMemberError } = useQuery({
        queryKey: ['projectMembers', projectId],
        queryFn: () => fetchAssociatedUsers(projectId),
        staleTime: 600000,
        // keepPreviousData: true,
        refetchOnWindowFocus: false,
        retry: 2,
    });

    // Mutation for updating project
    const updateProjectMutation = useMutation({
        mutationFn: (projectData) => updateProject(projectId, projectData),
        onSuccess: (data) => {
            queryClient.invalidateQueries(['project', projectId]);
            toast.success(data?.message || 'Project has been successfully updated.');
            setEditShowModal(false);
            setProjectData({
                name: '',
                description: '',
                startDate: '',
                dueDate: "",
                priority: 'medium',
                status: 'not started',
            });
            setFormErrors({});
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Server error. Please try again later.');
            console.error('Error updating project:', error);
        },
    });

    // Mutation for deleting project
    const deleteProjectMutation = useMutation({
        mutationFn: deleteProject,
        onSuccess: (data) => {
            queryClient.removeQueries(['project', projectId]);
            queryClient.invalidateQueries(['project']);
            setDeleteModal({
                isOpen: false,
                name: '',
                id: null,

            });
            toast.success(data?.message || 'Project has been successfully deleted.');
            navigate('/task_management/projects');
        },
        onError: (error) => {
            console.error('Error deleting project:', error);
            setDeleteModal({
                isOpen: false,
                name: '',
                id: null,
            });
            toast.error('Server error. Please try again later.');
        },
    });

    // Mutation for updating team members
    const updateMembersMutation = useMutation({
        mutationFn: updateProjectMembers,
        onSuccess: (data) => {
            // Invalidate and refetch the associated users after mutation
            queryClient.invalidateQueries(['associatedUsers', projectId]);
            toast.success(data?.message || 'Team members updates successfully.');
        },
        onError: (error) => {
            console.error('Error updating team members:', error);
            console.log(error.message);
            toast.error(error.message || 'Server error. Please try again later.');
        },
    });

    // Update project
    const handleUpdateProject = (project) => {
        setFormErrors({});
        const startDate = parseDateTimeString(project.start_date);
        const dueDate = parseDateTimeString(project.due_date);
        const updatedProjectData = {
            name: project.name,
            description: project.description,
            startDate: startDate,
            dueDate: dueDate,
            priority: project.priority,
            status: project.status,
        };
        setProjectData(updatedProjectData);
        setEditShowModal(updatedProjectData);
    };

    const confirmUpdateProject = async (e) => {
        e.preventDefault();
        try {
            setFormErrors({});
            projectSchema.parse(projectData);
            const dataToSend = {
                ...projectData,
                start_date: projectData.startDate.replace('T', ' '),
                due_date: projectData.dueDate.replace('T', ' '),
            };
            console.log(dataToSend);
            updateProjectMutation.mutate(dataToSend);
            setFormErrors({});
        } catch (error) {
            const errors = {};
            error.errors.forEach((err) => {
                errors[err.path[0]] = err.message;
            });
            setFormErrors(errors);
        }
    };

    // Function to open the delete modal with project details
    const openDeleteModal = (project) => {
        setDeleteModal({
            isOpen: true,
            name: project.name,
            id: project.id,
            type: "Project",
        });
    };
    const confirmDeleteProject = () => {
        if (showDeleteModal?.id) {
            deleteProjectMutation.mutate(showDeleteModal.id);
        }
    };

    // Handle saving selected members from modal
    const handleSaveMembers = (selectedMembers) => {
        console.log(selectedMembers);
        setselectedMembers(selectedMembers);
        const updates = {
            project_id: projectId,
            user_ids: [...selectedMembers].map(member => member.id),
        };
        // Call the bulk update mutation
        updateMembersMutation.mutate(updates);
    };

    function parseDateTimeString(dateTimeString) {
        // Split the date part and the time part
        const [datePart, timePart, period] = dateTimeString.split(' ');
        console.log(timePart, period);
        // Format the date part to YYYY-MM-DD
        const [day, month, year] = datePart.split('-');
        const formattedDate = `${year}-${month}-${day}`;

        // Extract time part
        //const [time, period] = timePart.split(' ');

        let [hours, minutes] = timePart.split(':');

        // Convert 12-hour format to 24-hour format if needed
        if (period === 'PM' && hours !== '12') {
            hours = (parseInt(hours) + 12).toString();
        } else if (period === 'AM' && hours === '12') {
            hours = '00';
        }

        // Combine date and time for datetime-local input
        return `${formattedDate}T${hours.padStart(2, '0')}:${minutes}`;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Update user data on change
        setProjectData((prevState) => ({
            ...prevState,
            [name]: value
        }));

        // Validate the individual field with Zod
        try {
            // Validate only the changed field using partial data
            baseProjectSchema.pick({ [name]: true }).parse({ [name]: value });

            // If valid, clear the specific field's error
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                [name]: undefined
            }));
        } catch (error) {
            // If validation fails, set the specific field's error
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                [name]: error.errors[0].message
            }));
        }
    };
    const startDate = useMemo(() => project?.start_date ? new Date(parseDateTimeString(project.start_date)) : null, [project]);
    const dueDate = useMemo(() => project?.due_date ? new Date(parseDateTimeString(project.due_date)) : null, [project]);

    useEffect(() => {
        if (startDate && dueDate && !isNaN(startDate.getTime()) && !isNaN(dueDate.getTime())) {
            const updateRemainingTime = () => {
                const now = new Date();
                const remaining = dueDate - now;
                if (remaining <= 0) {
                    // Task is overdue or completed
                    setRemainingTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                } else {
                    const days = differenceInDays(dueDate, now);
                    const hours = differenceInHours(dueDate, now) % 24; // Remaining hours after subtracting days
                    const minutes = differenceInMinutes(dueDate, now) % 60; // Remaining minutes after subtracting hours
                    const seconds = differenceInSeconds(dueDate, now) % 60; // Remaining seconds after subtracting minutes

                    // Only update state if remaining time has changed
                    setRemainingTime(prev => {
                        if (prev.days !== days || prev.hours !== hours || prev.minutes !== minutes || prev.seconds !== seconds) {
                            return { days, hours, minutes, seconds };
                        }
                        return prev;
                    });
                }
            };

            // Initial call to set remaining time
            updateRemainingTime();
            const interval = setInterval(updateRemainingTime, 1000);
            return () => clearInterval(interval);
        } else {
            setRemainingTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
    }, [startDate, dueDate]);

    const getChipColor = () => {
        const remainingInMs = remainingTime.days * 24 * 60 * 60 * 1000 +
            remainingTime.hours * 60 * 60 * 1000 +
            remainingTime.minutes * 60 * 1000 +
            remainingTime.seconds * 1000;

        if (remainingInMs <= 0) return 'gray'; // Task overdue
        if (remainingInMs <= 60 * 60 * 1000) return 'red'; // Less than 1 hour
        if (remainingInMs <= 24 * 60 * 60 * 1000) return 'yellow'; // Less than 1 day
        return 'green'; // More than 1 day
    };

    const projectDetailsRef = useRef(null);
    const teamMembersRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) { // lg breakpoint
                const projectDetailsHeight = projectDetailsRef.current.offsetHeight;
                teamMembersRef.current.style.height = `${projectDetailsHeight}px`;
            } else {
                teamMembersRef.current.style.height = 'auto'; // Reset on smaller screens
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call to set height on mount

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [project]);

    useEffect(() => {
        if (showEditModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [showEditModal]);

    return (
        <div>
            < div className="flex flex-col lg:flex-row rounded-md mt-2 mx-2 space-y-4 lg:space-y-0 lg:space-x-2 dark:bg-main-dark-bg" >
                {/* project details */}
                < div className="h-full w-full lg:w-3/4" ref={projectDetailsRef}>
                    <div className="max-w-full w-full space-y-6 bg-white p-5 rounded-xl shadow-lg dark:bg-secondary-dark-bg border border-gray-200 dark:border-gray-700">
                        <div className="mb-4 md:ml-4">
                            <Typography
                                variant="h5"
                                className="text-2xl font-bold capitalize text-gray-800 dark:text-gray-200 mt-1 mb-1"
                            >
                                {project?.name || "Project Name"}
                            </Typography>
                        </div>
                        <div className="space-y-4 sm:ml-2 md:ml-5">
                            <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-6">
                                {/* Timeline */}
                                <div>
                                    <label className="block text-gray-700 text-md font-bold mb-1 dark:text-gray-300">Timeline</label>
                                    <div className="flex justify-start items-center">
                                        <Tooltip content="Start date" className="bg-gray-300 text-gray-800 font-semibold dark:bg-gray-600 dark:text-gray-300">
                                            <Typography className="text-xs mr-1 font-semibold text-blue-600 dark:text-blue-500">
                                                <CalendarIcon className="h-4 w-4 text-gray-500 dark:text-gray-200" />
                                            </Typography>
                                        </Tooltip>
                                        <span className="text-gray-900 text-sm font-semibold dark:text-gray-200">{project?.start_date || "Not set"}</span>
                                        <ArrowLongRightIcon className='h-5 w-5 mx-2 text-gray-500 dark:text-gray-200' />
                                        <Tooltip content="Due date" className="bg-gray-300 text-gray-800 font-semibold dark:bg-gray-600 dark:text-gray-300">
                                            <Typography className="text-sm mr-1 font-semibold text-blue-600 dark:text-blue-500">
                                                <ClockIcon className="h-4 w-4 text-gray-500 dark:text-gray-200" />
                                            </Typography>
                                        </Tooltip>
                                        <span className="text-gray-900 text-sm font-semibold dark:text-gray-200">{project?.due_date || "Not set"}</span>
                                    </div>
                                    <div className="w-max mt-2">
                                        <Chip
                                            variant="ghost"
                                            size="sm"
                                            value={
                                                <>
                                                    <span className="font-medium mr-2">Remaining Time:</span>
                                                    <span className="font-bold">
                                                        {remainingTime.days}d {remainingTime.hours}h {remainingTime.minutes}m {remainingTime.seconds}s
                                                    </span>
                                                </>
                                            }
                                            color={getChipColor()} // Color based on remaining time
                                            className="dark:text-gray-300"
                                        />
                                    </div>
                                </div>

                                {/* Status */}
                                <div className='flex flex-grow gap-6 flex-wrap'>
                                    <div>
                                        <label className="block text-gray-700 text-md font-bold mb-1 dark:text-gray-300">Priority</label>
                                        <div className="w-max">
                                            <Chip
                                                variant="ghost"
                                                size="sm"
                                                value={project?.priority || "No priority available"}
                                                color={project?.priority === 'high' ? 'red' :
                                                    project?.priority === 'medium' ? 'yellow' :
                                                        project?.priority === 'low' ? 'green' :
                                                            'gray'}
                                                className="dark:text-gray-200"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-md font-bold mb-1 dark:text-gray-300">Status</label>
                                        <div className="w-max">
                                            <Chip
                                                variant="ghost"
                                                size="sm"
                                                value={project?.status || "No status available"}
                                                color={project?.status === 'completed' ? 'green' :
                                                    project?.status === 'pending' ? 'yellow' :
                                                        project?.status === 'overdue' ? 'red' :
                                                            'gray'}
                                                className="dark:text-gray-200"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="pt-4">
                                <label className="block text-gray-700 text-md font-bold mb-1 dark:text-gray-300">Description</label>
                                <p className="text-gray-900 text-sm dark:text-gray-200 mr-5">
                                    {project?.description ? project.description.charAt(0).toUpperCase() + project.description.slice(1) : "No description provided."}
                                </p>
                            </div>

                            {/* Close button */}
                            <Link
                                className="absolute top-3 right-5 inline-flex items-center px-2 py-1 border border-gray-200 rounded-md font-semibold text-gray-600 bg-white hover:bg-gray-100 focus:outline-none dark:text-gray-300 dark:bg-gray-600 dark:border-gray-700 dark:hover:bg-gray-500"
                                to="/task_management/projects"
                            >
                                <ArrowLeftIcon strokeWidth={2} className="h-3 w-3 text-gray-600 dark:text-gray-200 mr-1" />
                                Back
                            </Link>
                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-4 pt-5">
                                <Tooltip content="Reset">
                                    <IconButton variant="text">
                                        <ArrowPathIcon className="h-5 w-5 text-gray-600 dark:text-white" />
                                    </IconButton>
                                </Tooltip>
                                <button
                                    type="button"
                                    className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-500 transition-colors"
                                    onClick={() => openDeleteModal(project)}
                                >
                                    Delete
                                </button>
                                <button
                                    type="submit"
                                    className='bg-blue-600 capitalize text-white py-2 px-4 rounded-md'
                                    onClick={() => handleUpdateProject(project)}
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div >
                </div>
                <div className='h-full lg:w-1/4 pb-2 lg:pb-0 flex' ref={teamMembersRef}>
                    {/* Team Members */}
                    <TeamMembers
                        members={members}
                        isMemberLoading={isMemberLoading}
                        isMemberError={isMemberError}
                        setShowModal={setShowModal}
                    />
                </div>
            </div >

            {/* Project Tasks List */}
            <div className='m-2'>
                <ProjectTasksList
                    projectId={projectId}
                    project={project}
                    members={members} />
            </div>

            {/* Edit Project */}
            < div >
                {
                    showEditModal ? (
                        <>
                            <div className="flex justify-center md:backdrop-brightness-50 md:backdrop-blur-sm items-center overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none top-[10px]" style={{ zIndex: '1300' }}>
                                <div className="relative w-full my-6 mx-auto max-w-3xl ">
                                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none dark:bg-main-dark-bg">
                                        <div className="flex items-start justify-between p-4 border-b border-solid border-gray-300 rounded-t dark:border-gray-600">
                                            <h3 className="text-3xl font-semibold dark:text-white">Update Project</h3>
                                            <button type="button"
                                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                                onClick={() => setEditShowModal(null)}
                                            >
                                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" >
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                </svg >
                                                <span className="sr-only"> Close modal</span >
                                            </button >
                                        </div>
                                        <div className="relative p-2 flex-auto ">
                                            <form className="bg-gray-200 shadow-md rounded px-2 pt-2 pb-2 w-full dark:bg-secondary-dark-bg">
                                                <div className="p-4 space-y-6" >
                                                    <div className="grid grid-cols-6 gap-4" >
                                                        <div className="col-span-6 sm:col-span-3  mb-2" >
                                                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" > Project Name</label >
                                                            <input type="text" value={projectData.name} name="name" id="name" onChange={handleInputChange}
                                                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                placeholder="New project" required />
                                                            {formErrors.name && <span className="text-xs ml-2 text-red-500">{formErrors.name}</span>}
                                                        </div >
                                                        <div className="flex flex-wrap col-span-6 sm:col-span-3 mb-2 gap-4">
                                                            <div className="flex-grow">
                                                                <label htmlFor="priority" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Priority</label>
                                                                <select id="priority" name="priority" value={projectData.priority} onChange={handleInputChange}
                                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                >
                                                                    <option value="low">Low</option>
                                                                    <option value="medium">Medium</option>
                                                                    <option value="high">High</option>
                                                                </select>
                                                                {formErrors.status && <span className="text-xs ml-2 text-red-500">{formErrors.status}</span>}
                                                            </div>
                                                            <div className="flex-grow">
                                                                <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                                                                <select id="status" name="status" value={projectData.status} onChange={handleInputChange}
                                                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                >
                                                                    <option value="not started">Not Started</option>
                                                                    <option value="in progress">In Progress</option>
                                                                    <option value="completed">Completed</option>
                                                                </select>
                                                                {formErrors.status && <span className="text-xs ml-2 text-red-500">{formErrors.status}</span>}
                                                            </div >
                                                        </div >
                                                        <div className="col-span-6 sm:col-span-3  mb-2" >
                                                            <label htmlFor="startDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" > Start Date</label >
                                                            <input type="datetime-local" value={projectData.startDate} name="startDate" id="startDate" onChange={handleInputChange}
                                                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                required />
                                                            {formErrors.startDate && <span className="text-xs ml-2 text-red-500">{formErrors.startDate}</span>}
                                                        </div >
                                                        <div className="col-span-6 sm:col-span-3  mb-2" >
                                                            <label htmlFor="dueDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" > Due Date</label >
                                                            <input type="datetime-local" value={projectData.dueDate} name="dueDate" id="dueDate" onChange={handleInputChange}
                                                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                required />
                                                            {formErrors.dueDate && <span className="text-xs ml-2 text-red-500">{formErrors.dueDate}</span>}
                                                        </div >
                                                        <div className="col-span-6 md:col-span-6 sm:col-span-3" >
                                                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" > Description</label >
                                                            <textarea name="description" value={projectData.description} id="description" onChange={handleInputChange}
                                                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                placeholder="project description" required />
                                                            {formErrors.description && <span className="text-xs ml-2 text-red-500">{formErrors.description}</span>}
                                                        </div >
                                                    </div >
                                                </div >
                                            </form>
                                        </div>
                                        <div className="flex items-center justify-end p border-t border-solid border-gray-300 dark:border-gray-600 rounded-b">
                                            <div className="flex items-center p-4 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b dark:border-gray-600" >
                                                <button
                                                    className="text-red bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-blue-800"
                                                    type="button"
                                                    onClick={() => setEditShowModal(null)}
                                                >
                                                    Close
                                                </button>
                                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                    onClick={confirmUpdateProject}> Save all</button >
                                            </div >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : null}
            </div >

            {/* Delete project */}
            {
                showDeleteModal && (
                    <DeleteModal
                        showModal={showDeleteModal.isOpen}
                        data={showDeleteModal}
                        setShowModal={(isOpen) => setDeleteModal((prev) => ({ ...prev, isOpen }))}
                        onConfirm={confirmDeleteProject}
                    />
                )
            }

            {/* Modal for Adding Members */}
            {
                showModal && (
                    <AddTeamMembersModal
                        showModal={showModal}
                        setShowModal={setShowModal}
                        departments={departments}
                        projectId={projectId}
                        members={members}
                        onSave={handleSaveMembers}
                    />
                )
            }
        </div >
    )
};

export default ProjectDetails;
