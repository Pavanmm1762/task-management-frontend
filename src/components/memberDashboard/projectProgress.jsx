import React from 'react';

const projects = [
    { name: 'Website Redesign', progress: 75, projectNumber: 'PRJ-001' },
    { name: 'Mobile App Development', progress: 40, projectNumber: 'PRJ-002' },
    { name: 'Marketing Campaign', progress: 90, projectNumber: 'PRJ-003' },
];

const ProjectProgress = () => {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Project Progress</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
                {projects.map((project, index) => (
                    <div key={index} className="mb-6 last:mb-0">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <span className="text-sm font-medium text-gray-700">{project.name}</span>
                                <span className="ml-2 text-xs text-gray-500">{project.projectNumber}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-700">{project.progress}%</span>
                        </div>
                        <div className="relative pt-1">
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                                <div
                                    style={{ width: `${project.progress}%` }}
                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500 ease-in-out"
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectProgress;

