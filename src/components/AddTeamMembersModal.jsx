import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Button,
    Typography,
    Dialog,
} from "@material-tailwind/react";
import { fetchAvailableUsers } from '../services/apiService'; // Service to fetch users

const AddTeamMembersModal = ({ showModal, setShowModal, departments, projectId, members, onSave }) => {
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch all users using `useQuery`
    const { data: allMembers = [], isLoading, isError } = useQuery({
        queryKey: ['users', projectId],
        queryFn: () => fetchAvailableUsers(projectId),
    });

    useEffect(() => {
        if (showModal && allMembers?.length > 0 && members) {
            // Compare user IDs in members and allMembers to select already assigned members
            const alreadyAssigned = allMembers.filter(member =>
                members.some(assignedMember => assignedMember.id === member.id)
            );
            setSelectedMembers(alreadyAssigned);
        }

    }, [showModal, allMembers]);

    useEffect(() => {
        if (allMembers) {

            if (selectedDepartment) {
                const filtered = allMembers.filter(member => member.department === selectedDepartment);
                setFilteredMembers(filtered);
            } else {
                // If no department is selected, show all members
                setFilteredMembers(allMembers);
            }
        }
    }, [selectedDepartment, allMembers]);

    // Handle selecting members from the list
    const handleMemberSelect = (member) => {
        setSelectedMembers(prevSelectedMembers => {
            const newSelectedMembers = new Set(prevSelectedMembers);

            if (newSelectedMembers.has(member)) {
                newSelectedMembers.delete(member); // Remove the member if already selected
            } else {
                newSelectedMembers.add(member); // Add the member if not selected
            }

            return [...newSelectedMembers]; // Convert Set back to Array for state
        });
    };

    // Handle department change
    const handleDepartmentChange = (e) => {
        setSelectedDepartment(e.target.value);
        // setSelectedMembers([]); / / Clear selected members when switching departments
        setCurrentPage(1);
    };

    // Save selected members and close modal
    const handleSave = () => {
        onSave(selectedMembers);
        setShowModal(false);
    };

    // Calculate total pages
    const totalPages = Math.ceil(filteredMembers?.length / itemsPerPage) || 1;
    const paginatedMembers = filteredMembers?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <Dialog open={showModal} onClose={() => setShowModal(false)} className="dark:bg-main-dark-bg dark:text-white">
            <div className="p-4">
                <h2 className="text-lg font-bold">Add Team Members</h2>

                {/* Department Filter */}
                <div className="mt-4">
                    <label className="block mb-2 text-sm font-medium">Filter by Department:</label>
                    <select
                        value={selectedDepartment}
                        onChange={handleDepartmentChange}
                        className="w-full border p-2 rounded-md  dark:bg-gray-600"
                    >
                        <option value="">All</option>
                        {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>
                </div>

                {/* Members Grid */}
                <div className="mt-6 grid grid-cols-2 gap-2">
                    <h3 className="text-sm font-medium col-span-2">Select Team Members:</h3>
                    {isLoading ? (
                        <p>Loading users...</p>
                    ) : isError ? (
                        <p className="text-red-500">Failed to load users</p>
                    ) : (
                       !paginatedMembers || paginatedMembers?.length === 0 ? (
                            <div className="text-center p-1 ">
                                <Typography variant="small" className="text-sm py-1 font-medium blue-gray dark:text-gray-300">
                                    No members found
                                </Typography>
                            </div>
                        ) :
                            paginatedMembers?.map(member => (
                                <div key={member.id} className="flex items-center text-sm font-medium">
                                    <input
                                        type="checkbox"
                                        id={member.id}
                                        checked={selectedMembers.includes(member)}
                                        onChange={() => handleMemberSelect(member)}
                                        className="mr-2 focus-none"
                                    />
                                    <label htmlFor={member.id} className="text-gray-700 dark:text-white"> {member.full_name}</label>
                                </div>
                            ))
                    )}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-end items-center mt-4">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className='mx-2'>{`Page ${currentPage} of ${totalPages}`}</span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>

                {/* Selected Members */}
                <div className="mt-6">
                    <h3 className="text-sm font-medium">Selected Team Members:</h3>
                    <div className="mt-2">
                        {!selectedMembers || selectedMembers?.length === 0 ? (
                            <div className="ml-10 p-1">
                                <Typography variant="small" className="text-sm py-1 font-medium blue-gray dark:text-gray-300">
                                    No members are selected
                                </Typography>
                            </div>
                        ) : selectedMembers?.map(member => (
                            <span
                                key={member.id}
                                className="bg-gray-200 px-2 py-1 rounded-full mr-2 dark:bg-gray-500"
                            >
                                {member.full_name}
                                <button onClick={() => handleMemberSelect(member)} className=" p-2 text-red-500">x</button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end mt-6">
                    <Button color="red" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button color="blue" className="ml-2" onClick={handleSave}>Save</Button>
                </div>
            </div>
        </Dialog >
    );
};

export default AddTeamMembersModal;
