import React from 'react';
import { CheckCircle, Clock, AlertCircle, MoreVertical, Hourglass, Eye, Loader } from 'lucide-react';

const statusIcon = {
    completed: <CheckCircle className="h-5 w-5 text-green-500" />,
    pending: <Hourglass className="h-5 w-5 text-yellow-500" />,
    review: <Eye className="h-5 w-5 text-blue-500" />,
    'in progress': <Clock className="h-5 w-5 text-yellow-500" />,
    overdue: <AlertCircle className="h-5 w-5 text-red-500" />,
};

const priorityColors = {
    'high': 'bg-red-100 text-red-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'low': 'bg-green-100 text-green-800'
}
const statusColors = {
    'completed': 'bg-green-100 text-green-800',
    'in progress': 'bg-orange-100 text-orange-800',
    'review': 'bg-blue-100 text-blue-800',
    'pending': 'bg-yellow-100 text-yellow-800'
}

const TaskList = ({ tasks = [], loading, error }) => {

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Tasks</h3>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-500">View all</button>
            </div>
            <ul className="divide-y divide-gray-200">
                {loading ? (
                    <li className="px-4 py-4 sm:px-6 text-center">
                        <Loader className="h-6 w-6 text-blue-500 animate-spin inline-block" />
                        <span className="ml-2 text-gray-500">Loading tasks...</span>
                    </li>
                ) : error ? (
                    <li className="px-4 py-4 sm:px-6 text-center text-red-500">
                        Error loading tasks
                    </li>
                ) : (!tasks || tasks?.length === 0) ? (
                    <li className="px-4 py-4 sm:px-6 text-center text-gray-500">No tasks to display.</li>
                ) : (
                    tasks.map((task) => (
                        <li key={task.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    {statusIcon[task.status]}
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900 capitalize">{task.title}</p>
                                        <p className="text-xs text-gray-500">
                                            Priority:
                                            <span className={`px-1 rounded-full capitalize ${priorityColors[task.priority]}`}>
                                                {task.priority} </span>
                                            | Status:  <span className={`px-1 rounded-full capitalize ${statusColors[task.status]}`}>
                                                {task.status} </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {task.due_date}
                                    </p>
                                    <button className="ml-2 text-gray-400 hover:text-gray-500">
                                        <MoreVertical className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default TaskList;

