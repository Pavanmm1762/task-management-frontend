import { useEffect } from 'react';
import React from "react";
import Select from 'react-select';

export const AddUpdateTaskModal = ({ modal, members, handleInputChange, taskData, add, update, formErrors }) => {
    const options = [
        { value: '', label: 'Unassigned' },
        ...Array.isArray(members) ? members.map((member) => ({
            value: member.id,
            label: member.full_name,
        })) : []
    ];

    // Dark mode detection using Tailwind dark mode class
    const isDarkMode = document.documentElement.classList.contains('dark');

    const customStyles = {
        control: (base) => ({
            ...base,
            backgroundColor: isDarkMode ? '#4B5563' : '#f9fafb',
            borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
            minHeight: '40px',
            borderRadius: '0.375rem',
            color: isDarkMode ? '#d1d5db' : '#111827',
            boxShadow: 'none',
            WebkitOverflowScrolling: 'touch',
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: isDarkMode ? '#4B5563' : '#ffffff',
            maxHeight: '130px',
            padding: '2.5px',
        }),
        menuList: (base) => ({
            ...base,
            backgroundColor: isDarkMode ? '#4B5563' : '#ffffff',
            maxHeight: '130px',
            padding: '2px',
            WebkitOverflowScrolling: 'touch',
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? (isDarkMode ? '#1e293b' : '#e0f2fe') : (isDarkMode ? '#374151' : '#ffffff'),
            color: state.isSelected ? '#ffffff' : (isDarkMode ? '#d1d5db' : '#111827'),
            padding: '2.5px',
        }),
        singleValue: (base) => ({
            ...base,
            color: isDarkMode ? '#d1d5db' : '#111827',
        }),
    };

    useEffect(() => {
        if (modal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [modal]);

    const customTheme = (theme) => ({
        ...theme,
        colors: {
            ...theme.colors,
            primary: '#2563eb',
            primary25: isDarkMode ? '#1e293b' : '#e0f2fe',
        },
    });

    return (
        <div className="flex justify-center items-center md:backdrop-brightness-50 md:backdrop-blur-sm overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none " style={{ zIndex: '1300' }} >
            <div className="relative w-full my-6 mx-auto max-w-3xl ">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none dark:bg-main-dark-bg">
                    <div className="flex items-start justify-between p-4 border-b border-solid border-gray-300 rounded-t dark:border-gray-600">
                        <h3 className="text-2xl font-semibold capitalize dark:text-white">
                            {taskData?.id ? `Edit Task For ${taskData?.project_name}` : `New Task For ${taskData?.project_name}`}
                        </h3>
                        <button type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => modal(false)}
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
                                <div className="grid grid-cols-6 gap-2" >
                                    <div className="col-span-6 sm:col-span-3 mb-2">
                                        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" > Task Name</label >
                                        <input type="text" value={taskData.title} name="title" id="title" onChange={handleInputChange}
                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="Sample task" required />
                                        {formErrors?.title && <span className="text-xs ml-2 text-red-500">{formErrors?.title}</span>}
                                    </div >
                                    <div className="col-span-6 sm:col-span-3 mb-2" >
                                        <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                                        <select id="status" name="status" value={taskData.status} onChange={handleInputChange}
                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        >
                                            <option value="started">Started</option>
                                            <option value="pending">Pending</option>
                                            <option value="in progress">In progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                        {formErrors?.status && <span className="text-xs ml-2 text-red-500">{formErrors?.status}</span>}
                                    </div >
                                    <div className="col-span-6 sm:col-span-3 mb-2" >
                                        <label htmlFor="startDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" > Start Date</label >
                                        <input type="datetime-local" value={taskData.startDate} name="startDate" id="startDate" onChange={handleInputChange}
                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            required />
                                        {formErrors?.startDate && <span className="text-xs ml-2 text-red-500">{formErrors?.startDate}</span>}
                                    </div >
                                    <div className="col-span-6 sm:col-span-3 mb-2" >
                                        <label htmlFor="dueDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" > Due Date</label >
                                        <input type="datetime-local" value={taskData.dueDate} name="dueDate" id="dueDate" onChange={handleInputChange}
                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            required />
                                        {formErrors?.dueDate && <span className="text-xs ml-2 text-red-500">{formErrors?.dueDate}</span>}
                                    </div >
                                    <div className="col-span-6 sm:col-span-3 mb-2" >
                                        <label htmlFor="priority" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Priority</label>
                                        <select id="priority" name="priority" value={taskData.priority} onChange={handleInputChange}
                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                        {formErrors?.priority && <span className="text-xs ml-2 text-red-500">{formErrors?.priority}</span>}
                                    </div >

                                    <div className="col-span-6 sm:col-span-3 mb-2" >
                                        <label htmlFor="assigned_user_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Assigned To</label>
                                        <Select
                                            id="assigned_user_id"
                                            name="assigned_user_id"
                                            value={options?.find(option => option.value === taskData.assigned_user_id)}
                                            onChange={(selectedOption) => handleInputChange({ target: { name: 'assigned_user_id', value: selectedOption.value } })}
                                            options={options}
                                            classNamePrefix="react-select"
                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="--Select member--"
                                            styles={customStyles}
                                            theme={customTheme}
                                        />
                                    </div >

                                    <div className="col-span-6 md:col-span-6 sm:col-span-3" >
                                        <label htmlFor="description"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white " > Description</label >
                                        <textarea value={taskData.description}
                                            onChange={handleInputChange}
                                            name="description" id="description" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Brief Description" required />
                                        {formErrors?.description && <span className="text-xs ml-2 text-red-500">{formErrors?.description}</span>}
                                    </div >
                                </div >
                            </div >
                        </form>
                    </div>
                    <div className="flex items-center justify-end p-4 border-t border-solid border-gray-300 dark:border-gray-600 rounded-b">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse rounded-b" >
                            <button
                                className="text-red bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-blue-800"
                                type="button"
                                onClick={() => modal(false)}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                onClick={taskData?.id ? update : add}
                            >{taskData?.id ? 'Update' : 'Add'}</button >
                        </div >
                    </div>
                </div>
            </div >
        </div >
    );
};


