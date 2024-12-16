import React from 'react';
import {CheckCircle, Clock, AlertCircle, BarChart2} from 'lucide-react';

const SummaryItem = ({ icon, title, value, change }) => {
    return (
        <div className="flex items-center p-4 bg-white rounded-lg shadow">
            {icon}
            <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
                {/* <p className={`text-sm ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    {change > 0 ? `+${change}` : change} from yesterday
                </p> */}
            </div>
        </div>
    );
};

const TaskSummary = ({ data }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryItem icon={<CheckCircle className="h-8 w-8 text-green-500" />} title="Completed" value={data?.completed_tasks || 0} change={2} />
            <SummaryItem icon={<Clock className="h-8 w-8 text-yellow-500" />} title="In Progress" value={data?.in_progress_tasks || 0} change={-1} />
            <SummaryItem icon={<AlertCircle className="h-8 w-8 text-red-500" />} title="Overdue" value={data?.overdue_tasks || 0} change={0} />
            <SummaryItem icon={<BarChart2 className="h-8 w-8 text-blue-500" />} title="Total" value={data?.total_tasks || 0} change={1} />
        </div>
    );
};

export default TaskSummary;