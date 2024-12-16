import React from "react";
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";
import OverallReport from "./overallReport";
import ProjectReport from "./projectsReport";
import UsersReport from "./usersReport";

const ReportTabs = () => {
    const [activeTab, setActiveTab] = React.useState("overall");

    return (
        <div className="bg-white shadow-md rounded-lg bg-white dark:bg-secondary-dark-bg">
            <div className="flex items-center justify-between mb-3 pt-3 pl-3">
                <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200">Report Overview</h2>
            </div>
            <Tabs value={activeTab} className="dark:bg-dark-secondary-bg">
                <TabsHeader
                    className="rounded-none border-b border-blue-gray-50 bg-transparent p-0 max-w-md dark:border-gray-400"
                    indicatorProps={{
                        className: "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none dark:border-gray-400",
                    }}
                >
                    {["overall", "project", "user"].map((tab) => (
                        <Tab
                            key={tab}
                            value={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 text-center py-2 transition-colors ${activeTab === tab ? "text-gray-900 dark:text-gray-200 border-b-2 border-gray-900 dark:border-gray-400" : "text-gray-600 dark:text-gray-400"
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Tab>
                    ))}
                </TabsHeader>
                <TabsBody>
                    {/* Overall Tab */}
                    <TabPanel key="overall" value="overall">
                        <OverallReport />
                    </TabPanel>

                    {/* Project Tab */}
                    <TabPanel key="project" value="project">
                        <div>
                            <ProjectReport />
                        </div>
                    </TabPanel>

                    {/* User Tab */}
                    <TabPanel key="user" value="user">
                        <div>
                            <UsersReport />
                        </div>
                    </TabPanel>
                </TabsBody>
            </Tabs>
        </div >
    );
}
export default ReportTabs;