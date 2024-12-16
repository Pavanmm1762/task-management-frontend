import React from 'react';
import { Pie } from 'react-chartjs-2';
import { useStateContext } from '../../contexts/contextProvider';

const ProjectStatusChart = ({ reportData }) => {
    const { currentMode } = useStateContext(); // Get the current mode (light/dark)

    // Dynamic colors based on mode (light or dark)
    const chartColors = {
        light: {
            background: ["#FFCE56", "#36A2EB"], // Light mode colors
            border: ["#FAFBFB", "#FAFBFB"],
            titleColor: '#000', // Dark title color for light mode
        },
        dark: {
            background: ["#FF9F40", "#4BC0C0"], // Dark mode colors
            border: ["#33373E", "#33373E"],
            titleColor: '#fff', // Light title color for dark mode
        },
    };

    const selectedColors = currentMode === 'dark' ? chartColors.dark : chartColors.light;

    const data = {
        labels: ["Not Started Projects", "In Progress Projects"],
        datasets: [
            {
                data: [
                    reportData?.not_started_projects,
                    reportData?.in_progress_projects,
                ],
                backgroundColor: selectedColors.background, // Dynamic background color based on mode
                borderColor: selectedColors.border,
                borderWidth: 2, // Set border width for the pie chart
            },
        ],
    };

    const options = {
        plugins: {
            title: {
                display: true,
                text: 'Project Status',
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
            <Pie data={data} options={options} />
        </div>
    );
};

export default ProjectStatusChart;
