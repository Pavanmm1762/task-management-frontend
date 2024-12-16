/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import "../Styles/newProject.css";
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { IconButton, Tooltip } from '@material-tailwind/react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { createProject } from '../../../services/apiService';

const projectSchema = z.object({
    name: z.string()
        .min(2, { message: "Project name must be at least 2 characters" }),

    description: z.string()
        .optional()
        .nullable()
        .refine((value) => value === null || value === "" || value.length >= 5, {
            message: "Description must be at least 5 characters",
        }),

    startDate: z.string()
        .min(1, { message: "Start date is required" })
        .refine((val) => !isNaN(Date.parse(val)), { message: "Start date must be a valid date" }),

    dueDate: z.string()
        .min(1, { message: "Due date is required" })
        .refine((val) => !isNaN(Date.parse(val)), { message: "Due date must be a valid date" }),

    priority: z.enum(["low", "medium", "high"], {
        required_error: "Please select a status",
    }).optional(),

    status: z.enum(["not started", "in progress", "completed"], {
        required_error: "Please select a status",
    }).optional(),
}).refine((data) => new Date(data.dueDate) > new Date(data.startDate), {
    message: "Due date must be after start date",
    path: ["dueDate"],
});

const ProjectForm = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [projectData, setProjectData] = useState({
        name: '',
        description: '',
        startDate: '',
        dueDate: '',
        priority: 'medium',
        status: 'not started',
    });

    const { register: project, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(projectSchema),
    });

    // Mutation for creating a project
    const createProjectMutation = useMutation({
        mutationFn: createProject,
        onSuccess: (data) => {
            queryClient.invalidateQueries(['projects']);
            toast.success('Project created successfully.');
            const projectId = data?.project?.id;
            navigate(`/projects/${projectId}`)
            setProjectData({
                name: '',
                description: '',
                startDate: '',
                dueDate: '',
                priority: 'medium',
                status: 'not started',
            });
        },
        onError: (error) => {
            console.error('Error adding task:', error);
            toast.error(error.response?.data.error || 'Server error. Please try again later.');
        },
    });

    const onSubmit = (data) => {
        const dataToSend = {
            ...data,
            start_date: data.startDate.replace('T', ' '),
            due_date: data.dueDate.replace('T', ' '),
        };
        console.log("Project data:", dataToSend);
        createProjectMutation.mutate(dataToSend);
    };

    const handleCancel = () => {
        reset();
        toast.warn("The form has been reset.");
    };

    return (
        <div className="flex items-center justify-center px-2 sm:px-2 lg:px-6 mt-2">
            <div className="max-w-full w-full space-y-2 bg-white p-5 rounded-xl shadow-sm  dark:bg-secondary-dark-bg">
                <h2 className="text-3xl p-2 font-extrabold text-gray-900 dark:text-white">Create Your New Project</h2>
                <form className="mt-2 space-y-2 p-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Project Name</label>
                            <input
                                id="name"
                                type='text'
                                {...project("name")}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-200 dark:focus:ring-gray-600 dark:focus:border-blue-400 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Project name"
                            />
                            {errors.name && <p className="m-1 text-xs text-red-600">{errors.name.message}</p>}
                        </div>

                        <div className='flex flex-wrap justify-between gap-6'>
                            <div className="flex-grow">
                                <label htmlFor="priority" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Priority</label>
                                <select
                                    id="priority"
                                    type="text"
                                    {...project("priority")}
                                    className="shadow-sm w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-200 dark:focus:ring-gray-600 dark:focus:border-blue-400 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                                {errors.priority && <p className="m-1 text-xs text-red-600">{errors.priority.message}</p>}
                            </div>
                            <div className="flex-grow">
                                <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Status</label>
                                <select
                                    id="status"
                                    type="text"
                                    {...project("status")}
                                    className="shadow-sm w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-200 dark:focus:ring-gray-600 dark:focus:border-blue-400 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                >
                                    <option value="not started">Not Started</option>
                                    <option value="in progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                                {errors.status && <p className="m-1 text-xs text-red-600">{errors.status.message}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="startDate" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Start Date</label>
                            <input
                                id="startDate"
                                type="datetime-local"
                                {...project("startDate")}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-200 dark:focus:ring-gray-600 dark:focus:border-blue-400 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            />
                            {errors.startDate && <p className="m-1 text-xs text-red-600">{errors.startDate.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="dueDate" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Due Date</label>
                            <input
                                id="dueDate"
                                type="datetime-local"
                                {...project("dueDate")}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-200 dark:focus:ring-gray-600 dark:focus:border-blue-400 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            />
                            {errors.dueDate && <p className="m-1 text-xs text-red-600">{errors.dueDate.message}</p>}
                        </div>
                    </div>
                    <div className='pt-4'>
                        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Description</label>
                        <textarea
                            id='description'
                            name="description"
                            rows={5}
                            placeholder="Project description"
                            {...project("description")}
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-200 dark:focus:ring-gray-600 dark:focus:border-blue-400 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        />
                        {errors.description && <p className="m-1 text-xs text-red-600">{errors.description.message}</p>}
                    </div>
                    <div className="flex justify-end space-x-4 pt-5">
                        <Tooltip content="Reset">
                            <IconButton variant="text" onClick={handleCancel}>
                                <ArrowPathIcon className="h-5 w-5 text-gray-600 dark:text-white" />
                            </IconButton>
                        </Tooltip>
                        <Link to="/task_management/projects">
                            <button
                                type="button"
                                className="bg-red-600 text-white py-2 px-4 rounded-md"
                            >
                                Cancel
                            </button>
                        </Link>
                        <button
                            type="submit"
                            className={`bg-blue-600 text-white py-2 px-4 rounded-md ${createProjectMutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={createProjectMutation.isPending}
                        >
                            {createProjectMutation.isPending ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default ProjectForm;
