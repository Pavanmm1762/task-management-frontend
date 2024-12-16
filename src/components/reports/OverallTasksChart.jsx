import React from 'react';
import { Chart, registerables } from 'chart.js'; // Correct import for registerables
import { Bar } from 'react-chartjs-2';
import { useStateContext } from '../../contexts/contextProvider';

// Register all necessary components including the category scale
Chart.register(...registerables);

const OverallTasksChart = ({ reportData }) => {
    const { currentMode } = useStateContext(); // Get the current mode from context

    // Configure dynamic colors based on mode (light or dark)
    const chartColors = {
        light: {
            background: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(255, 99, 132, 0.6)',
            ],
            titleColor: '#000',
            gridColor: 'rgba(0, 0, 0, 0.1)',
            labelColor: '#000',
        },
        dark: {
            background: [
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
                'rgba(255, 159, 64, 0.8)',
                'rgba(255, 99, 132, 0.8)',
            ],
            titleColor: '#fff',
            gridColor: 'rgba(255, 255, 255, 0.2)',
            labelColor: '#fff',
        },
    };

    const selectedColors = currentMode === 'dark' ? chartColors.dark : chartColors.light;

    const data = {
        labels: ['Total', 'Completed', 'In Progress', 'Overdue'],
        datasets: [
            {
                label: 'Tasks',
                data: [
                    reportData?.total_tasks || 0,
                    reportData?.completed_tasks || 0,
                    reportData?.in_progress_tasks || 0,
                    reportData?.overdue_tasks || 0,
                ],
                backgroundColor: selectedColors.background,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false, // Hide legend
            },
            title: {
                display: true,
                text: 'Tasks Overview',
                color: selectedColors.titleColor, // Title color based on mode
                position: 'bottom',
            },
        },
        scales: {
            x: {
                ticks: {
                    color: selectedColors.labelColor, // X-axis label color
                },
                grid: {
                    color: selectedColors.gridColor, // Grid color for X-axis
                },
            },
            y: {
                ticks: {
                    color: selectedColors.labelColor, // Y-axis label color
                },
                grid: {
                    color: selectedColors.gridColor, // Grid color for Y-axis
                },
            },
        },
    };

    return <Bar data={data} options={options} />;
};

export default OverallTasksChart;
