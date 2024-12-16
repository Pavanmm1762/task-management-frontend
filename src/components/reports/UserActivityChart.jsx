import React from 'react';
import { PolarArea } from 'react-chartjs-2';
import { useStateContext } from '../../contexts/contextProvider';

const UserActivityChart = ({ reportData }) => {
    const { currentMode } = useStateContext(); // Get the current mode (light/dark)

    // Dynamic colors based on mode (light or dark)
    const chartColors = {
        light: {
            background: ["#4BC0C0", "#FF6384"],
            border: ["#FAFBFB", "#FAFBFB"],
            titleColor: '#000',
        },
        dark: {
            background: ["#1D9BF0", "#FF4B5A"],
            border: ["#33373E", "#33373E"],
            titleColor: '#fff',
        },
    };

    const selectedColors = currentMode === 'dark' ? chartColors.dark : chartColors.light;

    const data = {
        labels: ["Active Users", "Inactive Users"],
        datasets: [
            {
                data: [reportData?.active_users, reportData?.inactive_users],
                backgroundColor: selectedColors.background,
                borderColor: selectedColors.border,
                borderWidth: 2,
            },
        ],
    };

    const options = {
        plugins: {
            title: {
                display: true,
                text: 'User Status',
                position: 'bottom',
                color: selectedColors.titleColor, // Dynamic title color based on mode
                padding: {
                    top: 10,
                    bottom: 10,
                },
                font: {
                    size: 12,
                },
            },
            legend: {
                labels: {
                    color: selectedColors.titleColor, // Dynamic legend label color based on mode
                },
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <PolarArea data={data} options={options} />
        </div>
    );
};

export default UserActivityChart;
