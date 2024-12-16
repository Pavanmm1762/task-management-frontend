import React, { useState, useEffect, useMemo } from 'react';
import "../Styles/newProject.css";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as z from 'zod';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
    IconButton, Tooltip, Chip, Avatar, Typography,
} from '@material-tailwind/react';
import { CalendarIcon, ClockIcon, ArrowLongRightIcon, FolderIcon } from "@heroicons/react/24/solid";
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { fetchTaskDetails, updateTask, deleteTask, fetchAssociatedUsers } from '../../../services/apiService';
import { AddUpdateTaskModal } from '../../../components/projectDetails/addUpdateModal';
import { DeleteModal } from '../../../components/deleteModal';

const baseTaskSchema = z.object({
    title: z.string()
        .min(1, { message: "Title is required" })
        .min(3, { message: "Title must be at least 3 characters" }),

    startDate: z.string()
        .optional()
        .refine((val) => !val || !isNaN(Date.parse(val)), { message: "Start date must be a valid date" }),

    dueDate: z.string()
        .optional()
        .refine((val) => !val || !isNaN(Date.parse(val)), { message: "Due date must be a valid date" }),

    description: z.string().optional().nullable().refine((value) => value === null || value === "" || value.length >= 5, {
        message: "Description must be at least 5 characters",
    }),

    priority: z.enum(["low", "medium", "high"], { message: "Priority must be either 'low', 'medium', or 'high'" }),

    status: z.enum(["pending", "in progress", "completed", "started"], { message: "Status must be a valid value" }),

    assigned_user_id: z.union([z.string(), z.null()]).optional(),
});
const taskSchema = baseTaskSchema.refine((data) => {
    if (data.startDate && data.dueDate) {
        return new Date(data.dueDate) > new Date(data.startDate);
    }
    return true;
}, {
    message: "Due date must be after the start date",
    path: ["dueDate"],
});

const TaskDetails = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [taskData, setTaskData] = useState({
        id: null,
        project_name: '',
        title: '',
        startDate: '',
        dueDate: '',
        description: '',
        priority: 'medium',
        status: 'started',
        assigned_user_id: '',
    });
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showDeleteModal, setDeleteModal] = useState({
        isOpen: false,
        name: '',
        id: null,
        type: "Task",
    });
   // const [remainingPercentage, setRemainingPercentage] = useState(0);
    const [remainingTime, setRemainingTime] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [formErrors, setFormErrors] = useState({});

    const { projectId, taskId } = useParams();

    // Fetch Project data with caching and stale time settings
    // eslint-disable-next-line no-unused-vars
    const { data: task, isLoading: isTaskLoading, isError: isTaskError } = useQuery({
        queryKey: ['taskDetails', taskId],
        queryFn: () => fetchTaskDetails(projectId, taskId),
        staleTime: 600000, // 10 minutes
        cacheTime: 900000, // 15 minutes
        refetchOnWindowFocus: false,
        retry: 2,
    });

    // Fetch members data
    // eslint-disable-next-line no-unused-vars
    const { data: members, isLoading: isMemberLoading, isError: isMemberError } = useQuery({
        queryKey: ['members', projectId],
        queryFn: () => fetchAssociatedUsers(projectId),
        staleTime: 600000,
        // keepPreviousData: true,
        refetchOnWindowFocus: false,
        retry: 2,
    });

    // Mutation to update a task
    const updateTaskMutation = useMutation({
        mutationFn: (taskData) => updateTask({ projectId, taskData }),
        onSuccess: () => {
            queryClient.invalidateQueries(['taskDetails', taskId]);
            toast.success('Task updated successfully.');
            setShowTaskModal(false);
        },
        onError: (error) => {
            console.log(taskData);
            console.error('Error updating task:', error);
            toast.error(error.response?.data.error || 'Server error. Please try again later.');
        }
    });

    // Mutation to delete a task
    const deleteTaskMutation = useMutation({
        mutationFn: (taskId) => deleteTask(projectId, taskId), // API call for deleting task
        onSuccess: () => {
            queryClient.removeQueries(['taskDetails', taskId]);
            queryClient.invalidateQueries(['taskDetails', projectId]);
            toast.success('Task deleted successfully.');
            setDeleteModal(false);
            navigate("/task_management/tasks");
        },
        onError: (error) => {
            console.error('Error deleting task:', error);
            setDeleteModal(false);
            toast.error(error.response?.data.error || 'Server error. Please try again later.');
        }
    });

    // Show edit task model
    const handleUpdateTaskModel = (task) => {
        setFormErrors({});
        const startDate = task?.start_date ? parseDateTimeString(task.start_date) : '';
        const dueDate = task?.due_date ? parseDateTimeString(task?.due_date) : '';
        setTaskData({
            id: task.id,
            project_name: task.project_name || '',
            title: task.title || '',
            startDate: startDate || '',
            dueDate: dueDate || '',
            description: task.description || '',
            priority: task.priority || 'medium',
            status: task.status || 'started',
            assigned_user_id: task.assigned_user_id,
        });
        setShowTaskModal(task);
    };

    //update task
    const handleUpdateTask = async (e) => {
        e.preventDefault();
        if (taskData?.id) {
            try {
                setFormErrors({});
                taskSchema.parse(taskData);
                const dataToSend = {
                    ...taskData,
                    start_date: taskData?.startDate?.replace('T', ' '),
                    due_date: taskData?.dueDate?.replace('T', ' '),
                };
                console.log(dataToSend);
                updateTaskMutation.mutate(dataToSend);
                setFormErrors({});
            } catch (error) {
                const errors = {};
                error.errors.forEach((err) => {
                    errors[err.path[0]] = err.message;
                });
                setFormErrors(errors);
            }
        }
    };

    // Function to open the delete modal with project details
    const openDeleteModal = (task) => {
        setDeleteModal({
            isOpen: true,
            name: task.title,
            id: task.id,
            type: "Task",
        });
    };
    const confirmDeleteTask = () => {
        if (showDeleteModal.id) {
            deleteTaskMutation.mutate(showDeleteModal.id);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Update user data on change
        setTaskData((prevState) => ({
            ...prevState,
            [name]: value
        }));

        // Validate the individual field with Zod
        try {
            // Validate only the changed field using partial data
            baseTaskSchema.pick({ [name]: true }).parse({ [name]: value });

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

    function parseDateTimeString(dateTimeString) {
        // Split the date part and the time part
        const [datePart, timePart, period] = dateTimeString.split(' ');
        // Format the date part to YYYY-MM-DD
        const [day, month, year] = datePart.split('-');
        const formattedDate = `${year}-${month}-${day}`;

        let [hours, minutes] = timePart.split(':');

        // Convert 12-hour format to 24-hour format if needed
        if (period === 'PM' && hours !== '12') {
            hours = (parseInt(hours) + 12).toString();
        } else if (period === 'AM' && hours === '12') {
            hours = '00';
        }

        // Combine date and time for datetime-local input
        return `${formattedDate}T${hours.padStart(2, '0')}:${minutes}`;
    };

    const startDate = useMemo(() => task?.start_date ? new Date(parseDateTimeString(task.start_date)) : null, [task]);
    const dueDate = useMemo(() => task?.due_date ? new Date(parseDateTimeString(task.due_date)) : null, [task]);

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

    return (
        <>
            <div className="flex items-center justify-center px-2 sm:px-2 lg:px-6 mt-2">
                <div className="max-w-full w-full lg:w-[900px] space-y-6 bg-white p-5 rounded-xl shadow-lg dark:bg-secondary-dark-bg">
                    {/* Top section: Project Name and Task Title */}
                    <div className="mb-4 md:ml-4">
                        <Typography
                            variant="h5"
                            className="text-2xl font-bold capitalize text-gray-800 dark:text-gray-200 mt-1 mb-1"
                        >
                            {task?.title || "Task Title"}
                        </Typography>
                        <div className="flex items-center space-x-1">
                            <span className='text-sm font-semibold text-gray-600 dark:text-gray-400'>Under</span>
                            <FolderIcon className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                            <Link to={`/projects/${task?.project_id}`}>
                                <Typography
                                    variant="small"
                                    className="text-sm capitalize font-semibold text-gray-600 dark:text-gray-400"
                                >
                                    {task?.project_name || "Project Name"}
                                </Typography>
                            </Link>
                        </div>
                    </div>
                    {/* Task details */}
                    <div className="space-y-4 sm:ml-2 md:ml-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Timeline */}
                            <div>
                                <label className="block text-gray-700 text-md font-bold mb-1 dark:text-gray-300">Timeline</label>
                                <div className="flex justify-start items-center">
                                    <Tooltip content="Start date" className="bg-gray-300 text-gray-800 font-semibold dark:bg-gray-600 dark:text-gray-300">
                                        <Typography className="text-xs mr-1 font-semibold text-blue-600 dark:text-blue-500">
                                            <CalendarIcon className="h-4 w-4 text-gray-500 dark:text-gray-200" />
                                        </Typography>
                                    </Tooltip>
                                    <span className="text-gray-900 text-sm font-semibold dark:text-gray-200">{task?.start_date || "Not set"}</span>
                                    <ArrowLongRightIcon className='h-5 w-5 mx-2 text-gray-500 dark:text-gray-200' />
                                    <Tooltip content="Due date" className="bg-gray-300 text-gray-800 font-semibold dark:bg-gray-600 dark:text-gray-300">
                                        <Typography className="text-sm mr-1 font-semibold text-blue-600 dark:text-blue-500">
                                            <ClockIcon className="h-4 w-4 text-gray-500 dark:text-gray-200" />
                                        </Typography>
                                    </Tooltip>
                                    <span className="text-gray-900 text-sm font-semibold dark:text-gray-200">{task?.due_date || "Not set"}</span>
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

                            {/* Assignee */}
                            <div>
                                <label className="block text-gray-700 text-md font-bold mb-1 dark:text-gray-300">Assignee</label>
                                <div className="flex items-center gap-4">
                                    <Avatar src="https://docs.material-tailwind.com/img/face-2.jpg" alt="avatar" />
                                    <div>
                                        <Typography variant="h6" className='dark:text-gray-200'>{task?.assigned_user_name}</Typography>
                                        <Typography variant="small" className="text-gray-600 text-sm capitalize font-semibold dark:text-gray-300">
                                            {task?.user_designation || 'Not updated'}
                                        </Typography>
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-gray-700 text-md font-bold mb-1 dark:text-gray-300">Status</label>
                                <div className="w-max">
                                    <Chip
                                        variant="ghost"
                                        size="sm"
                                        value={task?.status || "No status available"}
                                        color={task?.status === 'completed' ? 'green' :
                                            task?.status === 'pending' ? 'yellow' :
                                                task?.status === 'overdue' ? 'red' :
                                                    'gray'}
                                        className="dark:text-gray-200"
                                    />
                                </div>
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="block text-gray-700 text-md font-bold mb-1 dark:text-gray-300">Priority</label>
                                <div className="w-max">
                                    <Chip
                                        variant="ghost"
                                        size="sm"
                                        value={task?.priority || "No priority available"}
                                        color={task?.priority === 'high' ? 'red' :
                                            task?.priority === 'medium' ? 'yellow' :
                                                task?.priority === 'low' ? 'green' :
                                                    'gray'}
                                        className="dark:text-gray-200"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="pt-4">
                            <label className="block text-gray-700 text-md font-bold mb-1 dark:text-gray-300">Description</label>
                            <p className="text-gray-900 text-sm dark:text-gray-200 mr-5">
                                {task?.description ? task.description.charAt(0).toUpperCase() + task.description.slice(1) : "No description provided."}
                            </p>
                        </div>

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
                                onClick={() => openDeleteModal(task)}
                            >
                                Delete
                            </button>
                            <button
                                type="submit"
                                className='bg-blue-600 capitalize text-white py-2 px-4 rounded-md'
                                onClick={() => handleUpdateTaskModel(task)}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div >


            {/* Update Task */}
            {showTaskModal && (
                < AddUpdateTaskModal
                    modal={setShowTaskModal}
                    members={members}
                    handleInputChange={handleInputChange}
                    taskData={taskData}
                    add={''}
                    update={handleUpdateTask}
                    formErrors={formErrors}
                />
            )
            }

            {/* Delete Task */}
            {
                showDeleteModal && (
                    <DeleteModal
                        showModal={showDeleteModal.isOpen}
                        data={showDeleteModal}
                        setShowModal={(isOpen) => setDeleteModal((prev) => ({ ...prev, isOpen }))}
                        onConfirm={confirmDeleteTask}
                    />
                )
            }
        </>
    );
};

export default TaskDetails;
