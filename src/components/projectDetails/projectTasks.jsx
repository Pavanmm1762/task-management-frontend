import React, { useState } from "react";
import {
    Card, CardHeader, CardBody, CardFooter, Typography, Input, Button, Tooltip, IconButton, Chip, Menu,
    MenuHandler,
    MenuList,
    MenuItem,
} from "@material-tailwind/react";
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon, MagnifyingGlassIcon, EyeIcon, EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { renderPagination } from "../pagination";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import { useDebounce } from "use-debounce";
import * as z from 'zod';
import { fetchTasks, addTask, updateTask, deleteTask } from "../../services/apiService";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AddUpdateTaskModal } from "./addUpdateModal";
import { DeleteModal } from "../deleteModal";
import { toast } from "react-toastify";

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

// Full schema with refine for final form submission validation
const taskSchema = baseTaskSchema.refine((data) => {
    if (data.startDate && data.dueDate) {
        return new Date(data.dueDate) > new Date(data.startDate);
    }
    return true;
}, {
    message: "Due date must be after the start date",
    path: ["dueDate"],
});

const ProjectTasksList = ({ projectId, project, members }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [taskData, setTaskData] = useState({
        id: null,
        title: '',
        startDate: '',
        dueDate: '',
        description: '',
        priority: 'medium',
        status: 'started',
        assigned_user_id: '',
    });
    const [showDeleteModal, setDeleteModal] = useState({
        isOpen: false,
        name: '',
        id: null,
    });
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [formErrors, setFormErrors] = useState({});
    const pageSize = 5;

    // Fetch Tasks data
    const { data: tasksList, isLoading: isTasksLoading, isError: isTasksError } = useQuery({
        queryKey: ['tasks', projectId, currentPage, debouncedSearchTerm],
        queryFn: () => fetchTasks(projectId, currentPage, debouncedSearchTerm, pageSize),
        staleTime: 300000, // 5 minutes
        refetchOnWindowFocus: false,
        retry: 2,
    });

    // Mutation for adding a task
    const addTaskMutation = useMutation({
        mutationFn: (taskData) => addTask({ projectId, taskData }),
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks', projectId]);
            toast.success('Task has been successfully added.');
            setShowTaskModal(false);
            setTaskData({ task_name: '', description: '', progress: 0, status: 'started' });
            setFormErrors({});
        },
        onError: (error) => {
            console.error('Error adding task:', error);
            toast.error(error.response?.data.error || 'Server error. Please try again later.');
        },
    });

    // Mutation to update a task
    const updateTaskMutation = useMutation({
        mutationFn: (taskData) => updateTask({ projectId, taskData }),
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks', projectId]);
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
            queryClient.invalidateQueries(['tasks', projectId]);
            toast.success('Task deleted successfully.');
            setDeleteModal(false);
        },
        onError: (error) => {
            console.error('Error deleting task:', error);
            setDeleteModal(false);
            toast.error(error.response?.data.error || 'Server error. Please try again later.');
        }
    });

    // Add task
    const handleAddTaskModel = () => {
        setFormErrors({});
        setTaskData({
            id: null,
            project_name: project?.name || '',
            title: '',
            startDate: '',
            dueDate: '',
            description: '',
            priority: 'medium',
            status: 'pending',
            assigned_user_id: '',
        });
        setShowTaskModal(true);
    };
    //add task to the project
    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            setFormErrors({});
            taskSchema.parse(taskData);
            console.log(taskData);
            const dataToSend = {
                ...taskData,
                start_date: taskData?.startDate?.replace('T', ' '),
                due_date: taskData?.dueDate?.replace('T', ' '),
            };
            addTaskMutation.mutate(dataToSend);
            setFormErrors({});
        } catch (error) {
            const errors = {};
            console.log(error);
            error.errors.forEach((err) => {
                errors[err.path[0]] = err.message;
            });
            setFormErrors(errors);
        }
    };

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
        });
    };
    const confirmDeleteTask = (taskId) => {
        if (taskId) {
            deleteTaskMutation.mutate(taskId);
        }
    };

    // Handle specific page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
        // fetchProjects(1);

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
    };

    return (
        <>
            <Card className="h-full w-full lg:w-2/3 bg-white border border-gray-200 rounded-xl shadow-lg p-4 dark:bg-secondary-dark-bg dark:border-gray-700">
                <CardHeader
                    floated={false}
                    shadow={false}
                    color='transparent'
                    className="rounded-none flex flex-wrap gap-4 justify-between sticky bg-white dark:bg-secondary-dark-bg top-[68px] z-20 p-5 mx-0 mt-0 border-b border-blue-gray-50 dark:border-gray-700"
                >
                    <div>
                        <Typography variant="h6" color="blue-gray" className="blue-gray dark:text-gray-300">
                            Tasks Overview
                        </Typography>
                        <Typography
                            variant="small"
                            className="flex items-center gap-1 font-normal text-blue-gray-600 dark:text-gray-400 mt-1"
                        >
                            <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                            <strong>30 done</strong> this month
                        </Typography>
                    </div>
                    <div className="flex items-center w-full shrink-0 gap-4 md:w-max ">
                        <div className="w-full md:w-72">
                            <Input
                                type="search"
                                placeholder="search with task name"
                                className="!border !border-gray-300 bg-white text-gray-900 dark:!border-gray-600 dark:text-gray-300 placeholder:text-gray-500 placeholder:opacity-100 focus:border-gray-900 focus:ring-gray-900/10 dark:focus:border-gray-400 dark:focus:ring-gray-400/10 dark:placeholder:text-gray-400 dark:bg-secondary-dark-bg"
                                icon={<MagnifyingGlassIcon className="h-5 w-5 dark:text-gray-400" />}
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <Button
                            variant="filled"
                            className="flex items-center gap-1"
                            onClick={() => handleAddTaskModel()}
                        >
                            Add Task
                        </Button>
                    </div>
                </CardHeader>
                <CardBody className="overflow-auto px-0 pt-2 mt-0 ml-2 mr-2 -mb-4">
                    <table className="w-full min-w-max table-auto text-left">
                        <thead className="border-none sticky top-0 z-10" >
                            <tr>
                                {["id", "Task Name", "Assignee", "Status", ""].map((el) => (
                                    <th
                                        key={el}
                                        className="border-b border-blue-gray-50 bg-gray-100 p-4 transition-colors dark:bg-gray-700 dark:border-gray-700"
                                    >
                                        <Typography
                                            variant="small"
                                            className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 opacity-90"
                                        >
                                            {el}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isTasksLoading ? (
                                // Skeleton rows for loading state
                                Array(5).fill().map((_, index) => (
                                    <tr key={index}>
                                        <td className="px-2 py-2" colSpan={6}><Skeleton height={40} /></td >
                                    </tr>
                                ))
                            ) : isTasksError ? (
                                <tr className="text-center border-t border-blue-gray-50 dark:border-gray-700">
                                    <td colSpan="5" className="text-center p-3">
                                        <Typography variant="small" className="text-sm py-3 font-medium blue-gray dark:text-gray-300">
                                            Error loading tasks
                                        </Typography>
                                    </td>
                                </tr>
                            ) : (!tasksList?.tasks || tasksList?.tasks.length === 0 ? (
                                <tr className="text-center border-t border-blue-gray-50 dark:border-gray-700">
                                    <td colSpan="5" className="text-center p-3">
                                        <Typography variant="small" className="text-sm py-3 font-medium blue-gray dark:text-gray-300">
                                            No tasks to display
                                        </Typography>
                                    </td>
                                </tr>
                            ) :
                                (tasksList?.tasks.map(
                                    (task, key) => {
                                        const className = `py-3 px-5  ${key === tasksList?.tasks.length - 1
                                            ? ""
                                            : "border-b border-blue-gray-50 dark:border-gray-700"
                                            } `;

                                        return (
                                            <tr key={task.id} >
                                                <td className={`whitespace-nowrap ${className}  w-1/8`}>
                                                    <Typography className="text-xs font-semibold capitalize text-gray-500 dark:text-gray-300">
                                                        {task.id.split('-')[0]}-{task.id.split('-')[2]}
                                                    </Typography>
                                                </td>
                                                <td className={`${className} whitespace-nowrap`}>
                                                    <div>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="text-sm font-bold capitalize text-gray-600 dark:text-gray-200 truncate w-full max-w-[100px] sm:max-w-[150px] lg:max-w-[150px] min-w-0 overflow-hidden"
                                                        >
                                                            {task.title}
                                                        </Typography>
                                                        <Tooltip content={task.description.charAt(0).toUpperCase() + task.description.slice(1)}
                                                            className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 max-w-[200px] md:max-w-[250px]">
                                                            <Typography className="text-xs font-semibold text-gray-800 dark:text-gray-300 opacity-70 truncate w-full max-w-[100px] sm:max-w-[150px] lg:max-w-[120px] min-w-0 overflow-hidden">
                                                                {task.description.charAt(0).toUpperCase() + task.description.slice(1)}
                                                            </Typography>
                                                        </Tooltip>
                                                    </div>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-gray-500 dark:text-gray-300">
                                                        {task.assigned_user_name || 'Unassigned'}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <div className="w-max">
                                                        <Chip
                                                            variant="ghost"
                                                            size="sm"
                                                            value={task?.status}
                                                            color={
                                                                task?.status === 'completed' ? 'green' :
                                                                    task?.status === 'pending' ? 'yellow' :
                                                                        task?.status === 'overdue' ? 'red' :
                                                                            'gray'
                                                            }
                                                            className="dark:text-gray-300"
                                                        />
                                                    </div>
                                                </td>
                                                <td className={`whitespace-nowrap ${className}`}>
                                                    <div className="flex items-center space-x-2">
                                                        <Link to={`/projects/${task.project_id}/tasks/${task.id}`}>
                                                            <Tooltip content="View" className="bg-gray-300 text-gray-800 font-semibold dark:bg-gray-600 dark:text-gray-300">
                                                                <Typography className="text-xs font-normal text-blue-600 dark:text-blue-500">
                                                                    <EyeIcon className="h-4 w-4 text-gray-500 dark:text-gray-200" />
                                                                </Typography>
                                                            </Tooltip>
                                                        </Link>
                                                        <Menu placement="left-start">
                                                            <MenuHandler>
                                                                <IconButton
                                                                    size="sm"
                                                                    variant="text"
                                                                    color="blue-gray"
                                                                    aria-label="More actions"
                                                                    className="blue-gray dark:text-gray-300"
                                                                >
                                                                    <EllipsisVerticalIcon
                                                                        strokeWidth={3}
                                                                        fill="currentColor"
                                                                        className="h-5 w-5"
                                                                    />
                                                                </IconButton>
                                                            </MenuHandler>

                                                            <MenuList className="dark:bg-secondary-dark-bg dark:text-gray-300 border-none">
                                                                <MenuItem onClick={() => handleUpdateTaskModel(task)} className='hover:bg-gray-200 dark:hover:bg-gray-600'>Edit</MenuItem>
                                                                <MenuItem onClick={() => openDeleteModal(task)} className='hover:bg-gray-200 dark:hover:bg-gray-600' > Delete</MenuItem>
                                                                <MenuItem onClick={() => navigate(`/projects/${task.project_id}/tasks/${task.id}`)} className='hover:bg-gray-200 dark:hover:bg-gray-600'>View Details</MenuItem>
                                                            </MenuList>
                                                        </Menu>
                                                    </div>
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
                <CardFooter className="flex justify-end items-center py-3 pb-0 flex-wrap gap-2 border-t border-blue-gray-50 dark:border-gray-700">
                    <Button
                        size="sm"
                        variant="text"
                        className="flex items-center gap-2 rounded-full text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                        disabled={currentPage === 1 || isTasksLoading}
                        onClick={() => setCurrentPage(prevPage => prevPage - 1)}
                    >
                        <ArrowLeftIcon strokeWidth={2} className="h-3 w-3 text-gray-600 dark:text-gray-200" />Previous
                    </Button>

                    <div className="flex flex-wrap">{renderPagination(tasksList?.totalPages || 1, currentPage, handlePageChange)}</div>

                    <Button
                        size="sm"
                        variant="text"
                        className="flex items-center gap-2 rounded-full text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                        disabled={!tasksList?.hasNext || isTasksLoading}
                        onClick={() => setCurrentPage(prevPage => prevPage + 1)}
                    >
                        Next
                        <ArrowRightIcon strokeWidth={2} className="h-3 w-3 text-gray-600 dark:text-gray-200" />
                    </Button>
                </CardFooter>
            </Card >

            {showTaskModal && (
                < AddUpdateTaskModal
                    modal={setShowTaskModal}
                    members={members}
                    handleInputChange={handleInputChange}
                    taskData={taskData}
                    add={handleAddTask}
                    update={handleUpdateTask}
                    formErrors={formErrors}
                />
            )}

            {/* Delete Task */}
            {showDeleteModal && (
                <DeleteModal
                    showModal={showDeleteModal.isOpen}
                    data={showDeleteModal}
                    setShowModal={(isOpen) => setDeleteModal((prev) => ({ ...prev, isOpen }))}
                    onConfirm={confirmDeleteTask}
                />
            )}
        </>
    );
};

export default ProjectTasksList;