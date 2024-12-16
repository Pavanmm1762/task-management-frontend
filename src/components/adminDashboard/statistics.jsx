// DashboardProjects.js
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import StatisticsCard from '../../widgets/cards/statistics-card';
import { Square3Stack3DIcon, ListBulletIcon, UsersIcon, QueueListIcon } from '@heroicons/react/24/outline';
import { fetchStatistics } from '../../services/apiService';

const Statistics = () => {
    // Use useQuery to fetch statistics
    const { data: statistics, isLoading, isError } = useQuery({
        queryKey: ['statistics'],
        queryFn: fetchStatistics,
        keepPreviousData: true,
    });

    const totalProjects = isLoading || isError || !statistics ? 0 : statistics?.total_projects || 0;
    const completedProjects = isLoading || isError || !statistics ? 0 : statistics?.completed_projects || 0;
    const totalUsers = isLoading || isError || !statistics ? 0 : statistics?.total_users || 0;
    const totalTasks = isLoading || isError || !statistics ? 0 : statistics?.total_tasks || 0;


    return (
        <div className="grid gap-y-6 gap-x-6 md:grid-cols-2 xl:grid-cols-4 m-5">
            <StatisticsCard
                key="Total Projects"
                title="Total Projects"
                value={totalProjects}
                icon={React.createElement(Square3Stack3DIcon, {
                    className: "w-6 h-6 text-white",
                })}
            />
            <StatisticsCard
                key="Completed Projects"
                title="Completed Projects"
                value={completedProjects}
                icon={React.createElement(ListBulletIcon, {
                    className: "w-6 h-6 text-white",
                })}
            />
            <StatisticsCard
                key="Total Users"
                title="Total Users"
                value={totalUsers}
                icon={React.createElement(UsersIcon, {
                    className: "w-6 h-6 text-white",
                })}
            />
            <StatisticsCard
                key="New Tasks"
                title="New Tasks"
                value={totalTasks}
                icon={React.createElement(QueueListIcon, {
                    className: "w-6 h-6 text-white",
                })}
            />
        </div>
    );
};

export default Statistics;
