import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useStateContext } from '../../contexts/contextProvider';

const OverallStats = ({ reportData }) => {
    const { currentMode } = useStateContext(); // Get the current mode (light/dark)

    // Dynamic colors based on mode (light or dark)
    const chartColors = {
        light: {
            background: ["#36A2EB", "#FF6384"],
            border: ["#FAFBFB", "#FAFBFB"],
            titleColor: '#000',
        },
        dark: {
            background: ["#4BC0C0", "#FF9F40"],
            border: ["#33373E", "#33373E"],
            titleColor: '#fff',
        },
    };

    const selectedColors = currentMode === 'dark' ? chartColors.dark : chartColors.light;

    const data = {
        labels: ["Completed", "Remaining"],
        datasets: [
            {
                data: [reportData?.completed_projects, reportData?.total_projects - reportData?.completed_projects],
                backgroundColor: selectedColors.background,
                borderColor: selectedColors.border,
            },
        ],
    };

    const options = {
        plugins: {
            title: {
                display: true,
                text: 'Project Completion',
                position: 'bottom',
                color: selectedColors.titleColor, // Title color based on mode
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
                    color: selectedColors.titleColor, // Legend text color based on mode
                },
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Doughnut data={data} options={options} />
        </div>
    );
};

export default OverallStats;
