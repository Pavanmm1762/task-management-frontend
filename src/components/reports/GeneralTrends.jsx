import React from 'react';

const GeneralTrends = ({ reportData }) => {
    // Task Trends
    const overdueTrend = reportData?.overdue_tasks > 0 ? "increased" : "decreased";
    const completionTrend = reportData?.completed_tasks > reportData?.in_progress_tasks
        ? "high completion rate"
        : "low completion rate";

    // Project Trends
    const projectCompletionTrend = reportData?.completed_projects > reportData?.total_projects - reportData?.completed_projects
        ? "high project completion"
        : "low project completion";

    const projectStatusTrend = reportData?.in_progress_projects > 0
        ? "more projects in progress"
        : "fewer projects in progress";

    // User Trends
    const activeUserTrend = reportData?.active_users > reportData?.total_users * 0.5
        ? "a healthy level of active users"
        : "a low level of active users";

    return (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 dark:bg-blue-400 dark:border-blue-800 dark:text-blue-900 px-4 py-3 rounded relative">
            <strong className="font-bold">Trends:</strong>
            <div className="mt-2">
                <span className="block sm:inline">
                    Task overdue rates have {overdueTrend}, and there is a {completionTrend}.
                </span>
            </div>
            <div className="mt-2">
                <span className="block sm:inline">
                    Project completion rates are {projectCompletionTrend}, with {projectStatusTrend}.
                </span>
            </div>
            <div className="mt-2">
                <span className="block sm:inline">
                    There is {activeUserTrend} in the organization.
                </span>
            </div>
        </div>
    );
};

export default GeneralTrends;
