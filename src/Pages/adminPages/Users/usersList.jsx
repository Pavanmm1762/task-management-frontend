import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import {
    MagnifyingGlassIcon,
    ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import Skeleton from 'react-loading-skeleton';
import img from '../../../data/img_avatar2.png';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as z from 'zod';
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
    Card,
    CardHeader,
    Input,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    Tabs,
    TabsHeader,
    Tab,
    Avatar,
    IconButton,
    Tooltip,
} from "@material-tailwind/react";
import { fetchUsers, updateUser, deleteUser } from '../../../services/apiService';
import { DeleteModal } from '../../../components/deleteModal';
import { renderPagination } from '../../../components/pagination';
import { userTabs } from '../../../components/tabs';

const TABLE_HEAD = ["ID", "Member", "Username", "Function", "Status", "Employed", ""];

const userSchema = z.object({
    full_name: z.string().min(2, { message: "Full name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    designation: z.string().optional().nullable().refine((value) => value === null || value === "" || value.length >= 2, {
        message: "Designation must be at least 2 characters",
    }),
    department: z.string().min(1, { message: "Please select a department" }),
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
});

const UserList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditModal, setEditShowModal] = useState(null);
    const [showDeleteModal, setDeleteModal] = useState({
        isOpen: false,
        name: '',
        id: null,
        type: "User",
    });
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [userData, setUserData] = useState({
        full_name: '',
        username: '',
        email: '',
        designation: '',
        department: '',
        status: '',
        gender: '',
        contact_no: '',
        admin_id: '',
    });
    const pageSize = 5;
    const queryClient = useQueryClient();
    const [formErrors, setFormErrors] = useState({});

    // React Query to fetch users, triggered by debouncedSearchTerm and page change
    const { data, isLoading, isError } = useQuery({
        queryKey: ['users', currentPage, debouncedSearchTerm],
        queryFn: () => fetchUsers(currentPage, debouncedSearchTerm, pageSize),
        keepPreviousData: true,
        staleTime: 600000, // 10 minutes
        cacheTime: 900000, // 15 minutes
        refetchOnWindowFocus: false,
        retry: 2,
    });

    // Mutation for updating user
    const updateUserMutation = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            toast.success('User has been successfully updated.');
            setEditShowModal(false);
            setUserData({
                full_name: '',
                username: '',
                email: '',
                designation: '',
                department: '',
                status: '',
                gender: '',
                contact_no: '',
                admin_id: '',
            });
            setFormErrors({});
        },
        onError: (error) => {
            console.error('Error updating user:', error);
            toast.error(error.message || 'Server error. Please try again later.');
        },
    });

    // Mutation for deleting user
    const deleteUserMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            toast.success('User has been successfully deleted.');
            setDeleteModal({
                isOpen: false,
                full_name: '',
                id: null,
            });
        },
        onError: (error) => {
            console.error('Error deleting user:', error);
            toast.error('Server error. Please try again later.');
            setDeleteModal({
                isOpen: false,
                full_name: '',
                id: null,
            });
        },
    });

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Update user
    const handleUpdateUser = (user) => {
        setUserData({
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            email: user.email,
            designation: user.designation || null,
            department: user.department,
            status: user.status,
            gender: user.gender || null,
            contact_no: user.contact_no,
            admin_id: user.admin_id,
        });
        setEditShowModal(user);
    };
    const handleUpdateUserSubmit = (e) => {
        e.preventDefault();
        // Validate user data with Zod
        try {
            setFormErrors({});
            userSchema.parse(userData);
            console.log(userData);
            updateUserMutation.mutate(userData);
            setFormErrors({});
        } catch (error) {
            const errors = {};
            error.errors.forEach((err) => {
                errors[err.path[0]] = err.message;
            });
            setFormErrors(errors);
        }
    };

    // Function to open the delete modal with user details
    const openDeleteModal = (user) => {
        setDeleteModal({
            isOpen: true,
            name: user.full_name,
            id: user.id,
            type: "User",
        });
    };
    // Handle delete user
    const handleDeleteUser = () => {
        console.log(showDeleteModal.id);
        if (showDeleteModal.id) {
            deleteUserMutation.mutate(showDeleteModal.id);
        }
    };

    const totalPages = data?.totalPages || 1;

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Update user data on change
        setUserData((prevState) => ({
            ...prevState,
            [name]: value
        }));

        // Validate the individual field with Zod
        try {
            // Validate only the changed field using partial data
            userSchema.pick({ [name]: true }).parse({ [name]: value });

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

    return (
        <>
            <div className="m-0 lg:mr-1 md:mr-1 md:ml-1">
                <Card className="h-full w-full bg-white dark:bg-secondary-dark-bg">
                    <CardHeader floated={false} shadow={false}
                        color='transparent'
                        className="rounded-none sticky bg-white top-[68px] z-20 mb-0.5 p-3 mx-0 mt-0 border-b border-blue-gray-50 bg-white dark:bg-secondary-dark-bg border-b border-blue-gray-50 dark:border-gray-700"
                    >
                        <div className="mb-3 flex items-center justify-between gap-8">
                            <div>
                                <Typography variant="h5" color="blue-gray" className="blue-gray dark:text-gray-300" >
                                    Members list
                                </Typography>
                                <Typography color="gray" className="mt-1 font-normal text-blue-gray-600 dark:text-gray-400">
                                    See information about all members
                                </Typography>
                            </div>
                            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                                <Button variant="outlined" size="sm" className="dark:text-gray-300 dark:border-gray-300">
                                    view all
                                </Button>
                                <Link to="/task_management/create-user" className="relative group ">
                                    <Button className="flex items-center gap-3" size="sm">
                                        <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add member
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                            <Tabs value="all" className="w-full md:w-max dark:text-gray-500">
                                <TabsHeader>
                                    {userTabs.map(({ label, value }) => (
                                        <Tab key={value} value={value}>
                                            &nbsp;&nbsp;{label}&nbsp;&nbsp;
                                        </Tab>
                                    ))}
                                </TabsHeader>
                            </Tabs>
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
                                    onChange={handleSearchChange}
                                    Handle search input change
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="-p-6 overflow-auto px-0 ml-4 mr-4">
                        <table className="w-full min-w-max table-auto text-left">
                            <thead className="border-none sticky top-0 z-10">
                                <tr>
                                    {TABLE_HEAD.map((head, index) => (
                                        <th
                                            key={head}
                                            className={`bg-gray-100 p-3 transition-colors dark:bg-gray-700 dark:border-gray-700
                                            ${head === 'Employed' ? 'hidden md:table-cell' : ''}`}
                                        >
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="text-xs flex items-center justify-between gap-2 font-bold uppercase text-gray-500 dark:text-gray-400 leading-none opacity-90"
                                            >
                                                {head}{" "}
                                                {index !== TABLE_HEAD.length - 1 && (
                                                    <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4 cursor-pointer" />
                                                )}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    Array(5).fill().map((_, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-2" colSpan={7}><Skeleton height={30} /></td>
                                        </tr>
                                    ))
                                ) : isError ? (
                                    <tr className="text-center border-t border-blue-gray-50 dark:border-gray-700">
                                        <td colSpan="7" className="text-center p-3">
                                            <Typography variant="small" className="text-sm py-3 font-medium blue-gray dark:text-gray-300">
                                                Error loading users
                                            </Typography>
                                        </td>
                                    </tr>
                                ) : (
                                    data?.users.length === 0 ? (
                                        <tr className="text-center border-t border-blue-gray-50 dark:border-gray-700">
                                            <td colSpan="7" className="text-center p-3">
                                                <Typography variant="small" className="text-sm py-3 font-medium blue-gray dark:text-gray-300">
                                                    No users to display
                                                </Typography>
                                            </td>
                                        </tr>
                                    ) : (
                                        data?.users.map(
                                            (user, index) => {
                                                const isLast = index === data.users.length - 1;
                                                const classes = isLast
                                                    ? "p-3"
                                                    : "p-3 border-b border-blue-gray-50 dark:border-gray-700";

                                                return (
                                                    <tr key={user.id} >
                                                        <td className={classes}>
                                                            <Typography className="text-xs font-semibold capitalize text-gray-500 dark:text-gray-300">
                                                                {user.id.split('-')[0]}-{user.id.split('-')[2]}
                                                            </Typography>
                                                        </td>
                                                        <td className={classes}>
                                                            <div className="flex items-center gap-3">
                                                                <Avatar src={img} alt={user.full_name} size="sm" />
                                                                <div className="flex flex-col">
                                                                    <Typography
                                                                        variant="small"
                                                                        color="blue-gray"
                                                                        className="font-bold capitalize text-gray-600 dark:text-gray-200"
                                                                    >
                                                                        {user.full_name}
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="small"
                                                                        color="blue-gray"
                                                                        className="text-sm font-semibold opacity-70 text-gray-600 dark:text-gray-200"
                                                                    >
                                                                        {user.email}
                                                                    </Typography>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className={classes}>
                                                            <Tooltip content={user.username}
                                                                className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 max-w-[200px] md:max-w-[250px]">
                                                                <Typography
                                                                    variant="small"
                                                                    color="blue-gray"
                                                                    className="text-sm font-semibold text-gray-500 dark:text-gray-300 truncate w-full max-w-[100px] sm:max-w-[120px] lg:max-w-[130px] min-w-0 overflow-hidden"
                                                                >
                                                                    {user.username}
                                                                </Typography>
                                                            </Tooltip>
                                                        </td>
                                                        <td className={classes}>
                                                            <div className="flex flex-col">
                                                                <Typography
                                                                    variant="small"
                                                                    color="blue-gray"
                                                                    className="text-normal font-semibold capitalize text-gray-500 dark:text-gray-300 truncate w-full max-w-[100px] sm:max-w-[120px] lg:max-w-[150px] min-w-0 overflow-hidden"
                                                                >
                                                                    {user.designation}
                                                                </Typography>
                                                                <Typography
                                                                    variant="small"
                                                                    color="blue-gray"
                                                                    className="text-xs uppercase text-gray-500 dark:text-gray-300 opacity-70"
                                                                >
                                                                    {user.department}
                                                                </Typography>
                                                            </div>
                                                        </td>
                                                        <td className={classes}>
                                                            <div className="w-max">
                                                                <Chip
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    //value={1 ? "online" : "offline"}
                                                                    value={user.status}
                                                                    color={1 ? "green" : "gray"}
                                                                    className="dark:text-gray-300"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className={`${classes} hidden md:table-cell`}>
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className=" text-xs font-semibold text-gray-500 dark:text-gray-300"
                                                            >
                                                                {user.created_at}
                                                            </Typography>
                                                        </td>
                                                        <td className={classes}>
                                                            <Tooltip content="Edit User">
                                                                <IconButton variant="text" onClick={() => handleUpdateUser(user)}>
                                                                    <PencilIcon className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip content="Delete User">
                                                                <IconButton variant="text" onClick={() => openDeleteModal(user)}>
                                                                    <TrashIcon className="h-4 w-4 text-red-500 dark:text-red-400" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                    )
                                )}
                            </tbody>
                        </table>
                    </CardBody>
                    <CardFooter className="flex justify-end items-end py-3 flex-wrap gap-2 border-t border-blue-gray-50 dark:border-gray-700">
                        <Button
                            size="sm"
                            variant="text"
                            className="flex items-center gap-2 rounded-full text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                            disabled={currentPage === 1 || isLoading}
                            onClick={() => setCurrentPage(prevPage => prevPage - 1)}
                        >
                            <ArrowLeftIcon strokeWidth={2} className="h-3 w-3 text-gray-600 dark:text-gray-200" />Previous
                        </Button>

                        <div className="flex flex-wrap">{renderPagination(totalPages, currentPage, handlePageChange)}</div>

                        <Button
                            size="sm"
                            variant="text"
                            className="flex items-center gap-2 rounded-full text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                            disabled={currentPage === totalPages || isLoading}
                            onClick={() => setCurrentPage(prevPage => prevPage + 1)}
                        >
                            Next
                            <ArrowRightIcon strokeWidth={2} className="h-3 w-3 text-gray-600 dark:text-gray-200" />
                        </Button>
                    </CardFooter>
                </Card >
            </div >

            {/* Edit User */}
            < div >
                {
                    showEditModal ? (
                        <>
                            <div className="flex justify-center md:backdrop-brightness-50 md:backdrop-blur-sm items-center overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none " style={{ zIndex: '1300' }}>
                                <div className="relative w-full my-6 mx-auto max-w-3xl ">
                                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none dark:bg-main-dark-bg">
                                        <div className="flex items-start justify-between p-4 border-b border-solid border-gray-300 rounded-t dark:border-gray-600">
                                            <h3 className="text-3xl font=semibold dark:text-white">Edit User</h3>
                                            <button type="button"
                                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                                onClick={() => setEditShowModal(null)}
                                            >
                                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" >
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                </svg >
                                                <span className="sr-only" > Close modal</span >
                                            </button >
                                        </div>
                                        <div className="relative p-2 flex-auto ">
                                            <form className="bg-gray-200 shadow-md rounded px-2 pt-2 pb-2 w-full dark:bg-secondary-dark-bg">
                                                <div className="p-4 space-y-6" >
                                                    <div className="grid grid-cols-6 gap-4" >
                                                        <div className="col-span-6 sm:col-span-3 mb-2" >
                                                            <label htmlFor="full_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" > Full Name</label >
                                                            <input type="text" value={userData.full_name} name="full_name" id="full_name" onChange={handleInputChange}
                                                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                placeholder="john jony" required />
                                                            {formErrors.full_name && <span className="text-xs ml-2 text-red-500">{formErrors.full_name}</span>}
                                                        </div >
                                                        <div className="col-span-6 sm:col-span-3" >
                                                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" > Email</label >
                                                            <input type="email" value={userData.email} name="email" id="email" onChange={handleInputChange}
                                                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                placeholder="example@company.com" required />
                                                            {formErrors.email && <span className="text-xs ml-2 text-red-500">{formErrors.email}</span>}
                                                        </div >
                                                        <div className="col-span-6 sm:col-span-3" >
                                                            <label htmlFor="designation" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" >Designation</label >
                                                            <input type="text" value={userData.designation} name="designation" id="designation" onChange={handleInputChange}
                                                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                placeholder="Software Engineer" required />
                                                            {formErrors.designation && <span className="text-xs text-red-500">{formErrors.designation}</span>}
                                                        </div >
                                                        <div className="col-span-6 sm:col-span-3" >
                                                            <label htmlFor="department" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Department</label>
                                                            <select id="department" name="department" value={userData.department} onChange={handleInputChange}
                                                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                            >
                                                                <option value="">Select a department</option>
                                                                <option value="hr">Human Resources</option>
                                                                <option value="it">Information Technology</option>
                                                                <option value="finance">Finance</option>
                                                                <option value="marketing">Marketing</option>
                                                            </select>
                                                            {formErrors.department && <span className="text-xs text-red-500">{formErrors.department}</span>}
                                                        </div >
                                                        <div className="col-span-6 sm:col-span-3" >
                                                            <label for="contact_no" onChange={(e) => setUserData({ ...userData, contact_no: e.target.value })} onFocus={() => setFormErrors('')}
                                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" >Contact No</label >
                                                            <input type="text" name="contact_no" id="contact_no"value={userData.contact_no} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                placeholder="+919034567890" required />
                                                        </div >
                                                        <div className="col-span-6 sm:col-span-3" >
                                                            <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" >Gender</label >
                                                            <div className="flex space-x-4 mt-2">
                                                                {["male", "female", "other"].map((gender) => (
                                                                    <div key={gender} className="flex text-sm items-center font-normal text-gray-700 dark:text-white">
                                                                        <input
                                                                            type="radio"
                                                                            id={gender}
                                                                            name="gender"
                                                                            value={gender}
                                                                            checked={userData.gender === gender}
                                                                            onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
                                                                            className="shadow-sm mr-2 mt-2 text-gray-900 text-sm rounded-lg focus:ring-blue-200 dark:focus:ring-blue-400 dark:focus:border-blue-400 dark:text-gray"
                                                                        />
                                                                        <label htmlFor={gender} className="mt-2 text-gray-700 dark:text-white">{gender.charAt(0).toUpperCase() + gender.slice(1)}</label>
                                                                    </div>
                                                                ))}
                                                            </div>
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
                                                    onClick={handleUpdateUserSubmit}
                                                > Save all</button >
                                            </div >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : null}
            </div >

            {/* Delete user */}
            {
                showDeleteModal && (
                    <DeleteModal
                        showModal={showDeleteModal.isOpen}
                        data={showDeleteModal}
                        setShowModal={(isOpen) => setDeleteModal((prev) => ({ ...prev, isOpen }))}
                        onConfirm={handleDeleteUser}
                    />
                )
            }
        </>
    );
};

export default UserList;