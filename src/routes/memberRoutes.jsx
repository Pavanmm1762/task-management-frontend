import React from 'react';
import { Route } from 'react-router-dom';
import MemberDashboard from '../Pages/memberPages/dashboard/memberDashboard';
//import MemberDashboard from "../Pages / memberPages / dashboard / memberDashboard";
import MemberTaskList from "../Pages/memberPages/tasks/memberTaskList";
import MemberProjectList from '../Pages/memberPages/memberProjects/projectsList';
//import MemberTaskDetails from "../Pages / memberPages / tasks / memberTaskDetails";
//import Chat from "../Pages / memberPages / chat";

export const memberRoutes = [
    <Route key="tasks-list" path="/task_management/tasks" element={<MemberTaskList />} />,
    <Route key="member-dashboard" path="/task_management/dashboard" element={<MemberDashboard />} />,
    <Route key="member-project-lists" path="/task_management/projects" element={<MemberProjectList />} />,
];



