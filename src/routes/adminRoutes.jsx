import React from 'react';
import { Route } from 'react-router-dom';
import AdminDashboard from "../Pages/adminPages/dashboard/adminDashboard";
import ProjectList from "../Pages/adminPages/Project/projectList";
import ProjectDetails from '../Pages/adminPages/Project/projectDetails';
import CreateProject from "../Pages/adminPages/Project/creatProject";
import TasksList from "../Pages/adminPages/tasks/tasksList";
import TaskDetails from "../Pages/adminPages/tasks/taskDetails";
import Report from "../Pages/adminPages/reports/reportDetails";
import UsersList from "../Pages/adminPages/Users/usersList";
import UserCreationForm from "../Pages/adminPages/Users/createUser";
import About from "../Pages/adminPages/about";
import Chat from "../Pages/adminPages/chat";

export const adminRoutes = [
    <Route key="admin-dashboard" path="/task_management/dashboard" element={<AdminDashboard />} />,
    <Route key="project-list" path="/task_management/projects" element={<ProjectList />} />,
    <Route key="project-details" path="/projects/:projectId" element={<ProjectDetails />} />,
    <Route key="create-project" path="/task_management/create-project" element={<CreateProject />} />,
    <Route key="tasks-list" path="/task_management/tasks" element={<TasksList />} />,
    <Route key="task-details" path="/projects/:projectId/tasks/:taskId" element={<TaskDetails />} />,
    <Route key="report" path="/task_management/report" element={<Report />} />,
    <Route key="users-list" path="/task_management/users" element={<UsersList />} />,
    <Route key="create-user" path="/task_management/create-user" element={<UserCreationForm />} />,
    <Route key="about" path="/task_management/about" element={<About />} />,
    <Route key="chat" path="/task_management/messages" element={<Chat />} />,
];
