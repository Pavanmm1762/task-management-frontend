import React from 'react';
import { CheckCircle, Edit, Trash2, Loader } from 'lucide-react';
import { formatDistanceToNowStrict, parseISO, addHours, addMinutes, } from 'date-fns';

const updateIcon = {
    created: <CheckCircle className="h-5 w-5 text-green-500" />,
    updated: <Edit className="h-5 w-5 text-yellow-500" />,
    deleted: <Trash2 className="h-5 w-5 text-red-500" />,
};

const RecentUpdates = ({ updates = [], loading, error }) => {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Updates</h3>
            </div>
            <ul className="divide-y divide-gray-200">
                {loading ? (
                    <li className="px-4 py-4 sm:px-6 text-center">
                        <Loader className="h-6 w-6 text-blue-500 animate-spin inline-block" />
                        <span className="ml-2 text-gray-500">Loading updates...</span>
                    </li>
                ) : error ? (
                    <li className="px-4 py-4 sm:px-6 text-center text-red-500">
                        Error loading updates
                    </li>
                ) : (!updates || updates.length === 0) ? (
                    <li className="px-4 py-4 sm:px-6 text-center text-gray-500">No updates to display.</li>
                ) : (updates.map((update) => (
                    <li key={update.ID} className="px-4 py-3 sm:px-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                        <div className="flex items-center">
                            {updateIcon[update.change_type]}
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">
                                    {update.updated_by} {update.change_type} {update.description}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatDistanceToNowStrict(addMinutes(addHours(parseISO(update.update_time), 0), 0))} ago
                                </p>
                            </div>
                        </div>
                    </li>
                ))
                )}
            </ul>
        </div>
    );
};

export default RecentUpdates;

