import { Card, CardBody, Typography, Tooltip, IconButton } from "@material-tailwind/react";
import { PencilIcon } from "@heroicons/react/24/solid";
import React from "react";
import avatar from '../../data/img_avatar2.png';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const TeamMembers = ({ members, isMemberLoading, isMemberError, setShowModal }) => {
    return (
        <Card className="w-full max-h-[350px] lg:max-h-[600px] bg-white border border-gray-200 rounded-lg shadow-xl p-4 dark:bg-secondary-dark-bg dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-bold text-gray-700 uppercase dark:text-gray-100">
                    Team Members
                </Typography>
                <Tooltip content="Update">
                    <IconButton variant="text" onClick={() => setShowModal(true)}  >
                        <PencilIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                    </IconButton>
                </Tooltip>
            </div>
            <CardBody className="p-0 overflow-y-auto">
                {isMemberLoading ? (
                    Array(4).fill().map((_, index) => (
                        <div key={index} className="py-2 px-3">
                            <Skeleton height={30} />
                        </div>
                    ))
                ) : isMemberError ? (
                    <div className="text-center p-3">
                        <Typography variant="small" className="text-sm py-3 font-medium text-red-600 dark:text-red-300">
                            Error loading members
                        </Typography>
                    </div>
                ) : (!members || members.length === 0 ? (
                    <div className="text-center p-2">
                        <Typography variant="small" className="text-sm py-2 font-medium text-gray-500 dark:text-gray-300">
                            No members
                        </Typography>
                    </div>
                ) : (
                    members.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center gap-3 py-2 px-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200"
                        >
                            <img className="h-10 w-10 rounded-full" src={user.avatar || avatar} alt={`${user.full_name}`} />
                            <div className="flex flex-1 items-center justify-between">
                                <div>
                                    <h5 className="font-medium text-black dark:text-white">{user.full_name}</h5>
                                    <p className="text-sm capitalize text-gray-600 dark:text-gray-300">
                                        {user.department} ({user.designation || 'not updated'})
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ))}
            </CardBody>
        </Card>
    );
};

export default TeamMembers;
