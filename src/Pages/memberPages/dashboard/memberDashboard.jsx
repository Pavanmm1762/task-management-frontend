import React from 'react';
import TaskSummary from '../../../components/memberDashboard/tasksSummary';
import TaskList from '../../../components/memberDashboard/taskList';
import RecentUpdates from '../../../components/memberDashboard/recentUpdates';
import RecentChats from '../../../components/memberDashboard/recentChats';
import TaskChart from '../../../components/memberDashboard/taskChart';
import ProjectProgress from '../../../components/memberDashboard/projectProgress';
import { useQuery } from '@tanstack/react-query';
import { fetchMemberDashboard, fetchChartData } from '../../../services/apiService';

const MemberDashboard = () => {

    const { data, isLoading, isError } = useQuery({
        queryKey: ['statistics'],
        queryFn: fetchMemberDashboard,
        keepPreviousData: true,
    });

    // eslint-disable-next-line no-unused-vars
    const { data: chartData, isLoading: loading, isError: error } = useQuery({
        queryKey: ['weeklyTaskData'],
        queryFn: fetchChartData,
        keepPreviousData: true,
    });

    return (
        <div className="max-w mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Task Dashboard</h2>
            <div className="mb-6">
                <TaskSummary data={data} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="lg:col-span-2 space-y-6">
                    <TaskChart chartData={chartData?.data ?? []} />
                    <TaskList tasks={data?.recent_tasks} loading={isLoading} error={isError} />
                </div>
                <div className="space-y-6">
                    <RecentUpdates updates={data?.recent_updates} loading={isLoading} error={isError} />
                    <RecentChats />
                    <ProjectProgress />
                </div>
            </div>
            {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">

                </div>
                <div className="space-y-6">
                    <ProjectProgress />
                    <RecentChats />
                </div>
            </div> */}
        </div>
    );
};

export default MemberDashboard;