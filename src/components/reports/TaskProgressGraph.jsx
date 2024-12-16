import React from 'react';
import { Line } from 'react-chartjs-2';
import { useStateContext } from '../../contexts/contextProvider'; // Import context to get the current mode

const TaskProgressGraph = ({ reportData }) => {
    const { currentMode } = useStateContext(); // Get the current mode (light/dark)

    // Define colors based on mode (light or dark)
    const chartColors = {
        light: {
            borderColor: 'rgba(75, 192, 192, 1)',
            titleColor: '#000',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
        },
        dark: {
            borderColor: 'rgba(255, 99, 132, 1)',
            titleColor: '#fff',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
        },
    };

    const selectedColors = currentMode === 'dark' ? chartColors.dark : chartColors.light;

    const data = {
        labels: ['Completed', 'In Progress', 'Overdue'],
        datasets: [
            {
                label: 'Task Status Progress',
                data: [
                    reportData?.completed_tasks || 0,
                    reportData?.in_progress_tasks || 0,
                    reportData?.overdue_tasks || 0,
                ],
                borderColor: selectedColors.borderColor, // Use dynamic border color based on mode
                backgroundColor: selectedColors.backgroundColor, // Optional: use dynamic background color
                fill: true, // Set fill to true if you want to see the area below the line
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: selectedColors.titleColor, // Dynamic legend label color based on mode
                },
            },
            title: {
                display: true,
                text: 'Task Status Progress',
                position: 'bottom',
                color: selectedColors.titleColor, // Dynamic title color based on mode
            },
        },
        scales: {
            x: {
                ticks: {
                    color: selectedColors.titleColor, // X-axis label color
                },
                grid: {
                    color: currentMode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)', // Dynamic grid color
                },
            },
            y: {
                ticks: {
                    color: selectedColors.titleColor, // Y-axis label color
                },
                grid: {
                    color: currentMode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)', // Dynamic grid color
                },
            },
        },
    };

    return <Line data={data} options={options} />;
};

export default TaskProgressGraph;
