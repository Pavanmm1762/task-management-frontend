import React, { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import OverallStats from '../../../components/reports/OverallStats';
import OverallTasksChart from '../../../components/reports/OverallTasksChart';
import TaskProgressGraph from '../../../components/reports/TaskProgressGraph';
import GeneralTrends from '../../../components/reports/GeneralTrends';
import DownloadButton from '../../../components/reports/DownloadButton';
import UserActivityChart from '../../../components/reports/UserActivityChart';
import ProjectStatusChart from '../../../components/reports/ProjectStatusChart';
import { fetchOverallReport } from '../../../services/apiService';
import { useStateContext } from '../../../contexts/contextProvider';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const OverallReport = () => {
    const { currentMode, setCurrentMode } = useStateContext();

    const { data: reportData, isLoading, error } = useQuery({
        queryKey: ["fetchOverallReport"],
        queryFn: fetchOverallReport,
        keepPreviousData: true,
        staleTime: 600000,
        cacheTime: 900000,
        refetchOnWindowFocus: false,
        retry: 2,
    });

    // Reference for the content to capture
    const reportRef = useRef();

    // Handle download logic (e.g., with jsPDF)
    const handleDownload = () => {
        console.log('Downloading report');
        const margin = 10;
        const input = reportRef.current;

        // Check if the document is in dark mode
        const isDarkMode = currentMode === 'dark' ? true : false;
        if (isDarkMode) {
            setCurrentMode('light');
        }

        setTimeout(() => {
            html2canvas(input).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');

                const imgWidth = 210 - 2 * margin;
                const pageHeight = 295 - 2 * margin;

                const imgHeight = canvas.height * imgWidth / canvas.width;
                let heightLeft = imgHeight;
                let position = margin + 20;

                pdf.setFontSize(18); // Set the font size for the heading
                pdf.text('Project Report', 105, margin + 10, { align: 'center' });

                pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    pdf.addPage();
                    pdf.text('Project Report', 105, margin + 10, { align: 'center' });
                    position = heightLeft - imgHeight;
                    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                pdf.save('Overall_Report.pdf');

                // Restore dark mode if it was previously enabled
                if (isDarkMode) {
                    setCurrentMode('dark');
                }
            });
        }, 500);
    };

    // Display loading and error states
    if (isLoading) return <div className='mt-5 text-gray-700'>Loading overall report...</div>;
    if (error) return <div>Error fetching overall report: {error.message}</div>;

    return (
        <div className="p-0">
            <div ref={reportRef} >
                <h3 className="text-gray-700 font-semibold dark:text-gray-300 mb-1">Overall Report Insights</h3>
                {/* Overall Stats */}
                <div className='flex flex-col md:flex-row justify-around items-center'>
                    <div className='w-60 h-60 lg:mt-0'>
                        <OverallStats reportData={reportData} />
                    </div>
                    <div className='w-60 h-60 mt-4 lg:mt-0'>
                        <ProjectStatusChart reportData={reportData} />
                    </div>
                    <div className='w-60 h-60 mt-4 lg:mt-0'>
                        <UserActivityChart reportData={reportData} />
                    </div>
                </div>

                {/* Container for all charts */}
                <div className="flex flex-col md:flex-row justify-around items-center flex-wrap">

                    {/* Bar/Pie Chart for Task Completion */}
                    <div className="w-full sm:w-80  md:w-1/2 my-4 p-4">
                        <OverallTasksChart reportData={reportData} />
                    </div>

                    {/* Task Progress Graph */}
                    <div className="w-full sm:w-80  md:w-1/2 my-4 p-4">
                        <TaskProgressGraph reportData={reportData} />
                    </div>

                </div>

                {/* General Trends */}
                <div className="my-4">
                    <GeneralTrends reportData={reportData} />
                </div>
            </div>

            {/* Download Button */}
            <div className='flex justify-end item-end'>
                <DownloadButton onDownload={handleDownload} />
            </div>
        </div >
    );
};

export default OverallReport;
