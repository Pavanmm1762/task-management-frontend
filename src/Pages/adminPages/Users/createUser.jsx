import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import { IconButton, Tooltip } from '@material-tailwind/react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useQueryClient } from '@tanstack/react-query';

const formSchema = z.object({
    username: z.string()
        .min(3, { message: "Username must be at least 3 characters" })
        .regex(/^(?![0-9]*$)[A-Za-z0-9_]+$/, { message: "Username must contain letters, numbers, or underscores only" })
        .refine(value => isNaN(value), { message: "Username cannot be only numbers" }),
    full_name: z.string().min(2, { message: "Full name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    designation: z.string().optional().nullable().refine((value) => value === null || value === "" || value.length >= 2, {
        message: "Designation must be at least 2 characters",
    }),
    department: z.string().min(1, { message: "Please select a department" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
    gender: z.enum(["male", "female", "other"], { required_error: "Please select a gender" }).optional().nullable(),
    contact_no: z.string()
        .optional()
        .nullable()
        .refine((value) => {
            if (value === null || value === "") return true; // Allow empty or null
            return /^(?:\+91|91)?[6-9]\d{9}$/.test(value); // Validate if provided
        }, {
            message: "Invalid phone number",

        }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const CreateUserForm = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        console.log(data);
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await axios.post(`${apiUrl}/api/users/create-user`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 201 || response.status === 200) {
                toast.success('User has been successfully created.');
                console.log(response.data);
                reset();
                // Refetch the 'users' query to get the latest data
                queryClient.refetchQueries('users');
                navigate('/task_management/users');
            } else {
                toast.error("Error creating user: " + response.error);
                throw new Error('Unexpected response from the server.');
            }
        } catch (error) {
            // Check for network issues
            if (!error.response) {
                toast.error('Network error. Please check your internet connection.');
            } else if (error.response.status === 400) {
                toast.error('Bad Request: Invalid input. Please check the form fields.');
            } else if (error.response.status === 409) {
                toast.error(error.response.data.error || 'User with this email or username already exists.');
            } else if (error.response.status === 500) {
                toast.error('Server error. Please try again later.');
            } else {
                toast.error(error.response.data?.message || 'An unexpected error occurred.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        reset();
        toast.warn("The form has been reset.");
    };

    return (
        <div className="flex items-center justify-center px-2 sm:px-2 lg:px-6 mt-2">
            <div className="max-w-full w-full space-y-2 bg-white p-5 rounded-xl shadow-sm  dark:bg-secondary-dark-bg">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Create User</h2>
                <form className="mt-0 space-y-2" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/** Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Username</label>
                            <input
                                id="username"
                                type='text'
                                {...register("username")}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-200 dark:focus:ring-gray-600 dark:focus:border-blue-400 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                placeholder="johndoe123"
                            />
                            {errors.username && <p className="m-1 text-xs text-red-600">{errors.username.message}</p>}
                        </div>

                        {/** Full Name Field */}
                        <div>
                            <label htmlFor="full_name" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Full Name</label>
                            <input
                                id="full_name"
                                type="text"
                                {...register("full_name")}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-200 dark:focus:ring-gray-600 dark:focus:border-blue-400 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                placeholder="John Doe"
                            />
                            {errors.full_name && <p className="m-1 text-xs text-red-600">{errors.full_name.message}</p>}
                        </div>

                        {/** Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Email</label>
                            <input
                                id="email"
                                type="email"
                                {...register("email")}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-200 dark:focus:ring-gray-600 dark:focus:border-blue-400 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                placeholder="john.doe@example.com"
                            />
                            {errors.email && <p className="m-1 text-xs text-red-600">{errors.email.message}</p>}
                        </div>

                        {/** Designation Field */}
                        <div>
                            <label htmlFor="designation" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Designation</label>
                            <input
                                id="designation"
                                type="text"
                                {...register("designation")}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-200 dark:focus:ring-gray-600 dark:focus:border-blue-400 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Software Engineer"
                            />
                            {errors.designation && <p className="m-1 text-xs text-red-600">{errors.designation.message}</p>}
                        </div>

                        {/** Department Field */}
                        <div>
                            <label htmlFor="department" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Department</label>
                            <select
                                id="department"
                                type="text"
                                {...register("department")}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-200 dark:focus:ring-gray-600 dark:focus:border-blue-400 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            >
                                <option value="">Select a department</option>
                                <option value="hr">Human Resources</option>
                                <option value="it">Information Technology</option>
                                <option value="finance">Finance</option>
                                <option value="marketing">Marketing</option>
                            </select>
                            {errors.department && <p className="m-1 text-xs text-red-600">{errors.department.message}</p>}
                        </div>

                        {/** Phone Number Field */}
                        <div>
                            <label htmlFor="contact_no" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Phone Number</label>
                            <input
                                id="contact_no"
                                type="text"
                                {...register("contact_no")}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-200 dark:focus:ring-gray-600 dark:focus:border-blue-400 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                placeholder="+919034567890"
                            />
                            {errors.contact_no && <p className="m-1 text-xs text-red-600">{errors.contact_no.message}</p>}
                        </div>

                        {/** Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Password</label>
                            <input
                                id="password"
                                type="password"
                                {...register("password")}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-200 dark:focus:ring-gray-600 dark:focus:border-blue-400 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Enter your password"
                            />
                            {errors.password && <p className="m-1 text-xs text-red-600">{errors.password.message}</p>}
                        </div>

                        {/** Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                {...register("confirmPassword")}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-200 focus:border-blue-200 dark:focus:ring-gray-600 dark:focus:border-blue-400 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                placeholder="Confirm your password"
                            />
                            {errors.confirmPassword && <p className="m-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
                        </div>
                    </div>

                    {/** Gender Field */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">Gender</label>
                        <div className="flex space-x-4 mt-2">
                            {["male", "female", "other"].map((gender) => (
                                <div key={gender} className="flex text-sm items-center font-normal text-gray-700 dark:text-white">
                                    <input
                                        type="radio"
                                        id={gender}
                                        value={gender}
                                        {...register("gender")}
                                        className="shadow-sm mr-2 text-gray-900 text-sm rounded-lg focus:ring-blue-200 dark:focus:ring-gray-600 dark:focus:border-blue-400 dark:text-gray"
                                    />
                                    <label htmlFor={gender} className="text-gray-700 dark:text-white">{gender.charAt(0).toUpperCase() + gender.slice(1)}</label>
                                </div>
                            ))}
                        </div>
                        {errors.gender && <p className="m-1 text-xs text-red-600">{errors.gender.message}</p>}
                    </div>

                    {/** Form Actions */}
                    <div className="flex justify-end space-x-4">
                        <Tooltip content="Reset">
                            <IconButton variant="text" onClick={handleCancel}>
                                <ArrowPathIcon className="h-5 w-5 text-gray-600 dark:text-white" />
                            </IconButton>
                        </Tooltip>
                        <Link to="/task_management/users">
                            <button
                                type="button"
                                className="bg-red-600 text-white py-2 px-4 rounded-md"
                            >
                                Cancel
                            </button>
                        </Link>
                        <button
                            type="submit"
                            className={`bg-blue-600 text-white py-2 px-4 rounded-md ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default CreateUserForm;
