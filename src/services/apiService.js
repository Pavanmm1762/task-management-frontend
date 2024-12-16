// src/services/apiService.js
import axios from 'axios';
import { toast } from 'react-toastify';

const apiUrl = process.env.REACT_APP_API_URL;
let isToastVisible = false;

// Create an axios instance with default config and set default Authorization header
const apiClient = axios.create({
    baseURL: apiUrl, // Ensure REACT_APP_API_URL is set
    timeout: 10000,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors globally
apiClient.interceptors.response.use(
    (response) => {
        isToastVisible = false;
        return response;
    },
    (error) => {
        if (error.code === 'ERR_NETWORK') {
            // Handle network error (e.g., server is down, network is offline)
            console.error('Network error occurred:', error.message);
            if (!isToastVisible) {
                isToastVisible = true;
                toast.error('Network error occurred. Please check your connection.');
                setTimeout(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('isLoggedIn');
                    //  window.location.href = '/login';
                }, 2000);
            }
        } else if (error.response && error.response.status === 401) {
            // Handle unauthorized error
            console.error('Unauthorized access - redirecting to login');
            if (!isToastVisible) {
                isToastVisible = true; // Set flag to true
                toast.error('Login expired, please login.');
                setTimeout(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('isLoggedIn');
                    window.location.href = '/login';
                }, 2000);
            }
        } else {
            // Handle other errors
            console.error('API error:', error.response?.data?.message || error.message);
        }
        return Promise.reject(error);
    }
);

// Fetch a statistics
export const fetchStatistics = async () => {
    const response = await apiClient.get(`${apiUrl}/api/dashboard`);
    return response.data;
};

// Fetch users with pagination and search
export const fetchUsers = async (page, searchTerm = '', pageSize) => {
    try {
        const params = {
            page: page,
            limit: pageSize,
        };

        if (searchTerm) {
            params.search = searchTerm;
        }

        const response = await apiClient.get('/api/users', {
            params
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
};

// Update user by ID
export const updateUser = async (userData) => {
    try {
        const response = await apiClient.put(`/api/users/${userData.id}`, userData);

        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error(error.response?.data?.message || 'Failed to update user');
    }
};

// Delete user by ID
export const deleteUser = async (userId) => {
    try {
        const response = await apiClient.delete(`/api/users/${userId}`);

        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
};

// Mutation to add a project
export const createProject = async (projectData) => {
    try {
        const response = await apiClient.post(`/api/projects`, projectData);
        return response.data;
    } catch (error) {
        console.error('Error adding project:', error);
        throw new Error(error.response?.data?.message || 'Failed to add project');
    }
};

// Fetch a project lists
export const fetchProjects = async (page = 1, searchTerm = '', pageSize = 5) => {
    try {
        const params = {
            page: page,
            limit: pageSize,
        };

        if (searchTerm) {
            params.search = searchTerm;
        }

        const response = await apiClient.get(`/api/projects`, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch projects');
    }
};

// Fetch a project by its ID
export const fetchProject = async (projectId) => {
    try {
        const response = await apiClient.get(`/api/project/${projectId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching project:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch project');
    }
};

// Fetch tasks
export const fetchTasks = async (projectId = null, page = 1, searchTerm = '', pageSize = 10) => {
    try {
        const params = {
            page: page,
            limit: pageSize,
        };

        // Only include project_id in params if it is provided
        if (projectId) {
            params.project_id = projectId;
        }

        // Only include search term if it is provided
        if (searchTerm) {
            params.search = searchTerm;
        }

        const response = await apiClient.get(`/api/tasks`, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
    }
};

// Fetch a task by its ID
export const fetchTaskDetails = async (projectId, taskId) => {
    try {
        const response = await apiClient.get(`/api/projects/${projectId}/tasks/${taskId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching task:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch task');
    }
};

// Mutation to update a project
export const updateProject = async (projectId, projectData) => {
    console.log(projectData);
    try {
        const response = await apiClient.put(`/api/project/${projectId}`, projectData);
        return response.data;
    } catch (error) {
        console.error('Error updating project:', error);
        throw new Error(error.response?.data?.message || 'Failed to update project');
    }
};

// Mutation to delete a project
export const deleteProject = async (id) => {
    try {
        const response = await apiClient.delete(`/api/project/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting project:', error);
        throw new Error(error.response?.data?.message || 'Failed to delete project');
    }
};

// Mutation to add a task to a project
export const addTask = async ({ projectId, taskData }) => {
    try {
        const response = await apiClient.post(`/api/projects/${projectId}/tasks`, taskData);
        return response.data;
    } catch (error) {
        console.error('Error adding task:', error);
        throw new Error(error.response?.data?.message || 'Failed to add task');
    }
};

// Mutation to update a task in a project
export const updateTask = async ({ projectId, taskData }) => {
    try {
        const response = await apiClient.put(`/api/projects/${projectId}/tasks/${taskData?.id}`, taskData);
        return response.data;
    } catch (error) {
        console.error('Error updating task:', error);
        throw new Error(error.response?.data?.message || 'Failed to update task');
    }
};

// Mutation to delete a task from a project
export const deleteTask = async (projectId, taskId) => {
    try {
        const response = await apiClient.delete(`/api/projects/${projectId}/tasks/${taskId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting task:', error);
        throw new Error(error.response?.data?.message || 'Failed to delete task');
    }
};

// Fetch users already associated with a project
export const fetchAssociatedUsers = async (projectId) => {
    try {
        const response = await apiClient.get(`/api/project/${projectId}/members`);
        return response.data;
    } catch (error) {
        console.error('Error fetching associated users:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch associated users');
    }
};

// Fetch available users (not yet assigned to a project)
export const fetchAvailableUsers = async (projectId) => {
    try {
        const response = await apiClient.get(`/api/users/${projectId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching available users:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch available users');
    }
};

// Update the members associated with a project
export const updateProjectMembers = async (data) => {
    try {
        const response = await apiClient.put(`/api/project/${data.project_id}/members`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating project members:', error);
        throw new Error(error.response?.data?.error || 'Failed to update project members');
    }
};

// Fetch overall report
export const fetchOverallReport = async () => {
    const response = await apiClient.get(`api/reports/overall`);
    return response.data;
};

// Fetch all projects report
export const fetchProjectsReport = async (page = 1, searchTerm = '', pageSize = 5) => {
    const params = {
        page: page,
        limit: pageSize,
    };

    if (searchTerm) {
        params.search = searchTerm;
    }

    const response = await apiClient.get(`/api/reports/projects/summaries`, { params });
    return response.data;
};

// Fetch individual project report
export const fetchProjectReport = async (projectId) => {
    const response = await apiClient.get(`api/reports/projects/${projectId}`);
    return response.data;
};

// Fetch all users report
export const fetchUsersReport = async (page = 1, searchTerm = '', pageSize = 5) => {
    const params = {
        page: page,
        limit: pageSize,
    };

    if (searchTerm) {
        params.search = searchTerm;
    }

    const response = await apiClient.get(`/api/reports/users/summaries`, { params });
    return response.data;
};

// Fetch individual user report
export const fetchUserReport = async (userId) => {
    const response = await apiClient.get(`api/reports/users/${userId}`);
    return response.data;
};

// Member
// Fetch member tasks
export const fetchMemberDashboard = async () => {
    try {
        const response = await apiClient.get(`/api/member/dashboard`);
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch dashboard');
    }
};

// Fetch a member project lists
export const fetchMemberProjects = async (page = 1, searchTerm = '', pageSize = 5) => {
    try {
        const params = {
            page: page,
            limit: pageSize,
        };

        if (searchTerm) {
            params.search = searchTerm;
        }

        const response = await apiClient.get(`/api/member/projects-list`, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching member projects:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch member projects');
    }
};

// Fetch member weekly overview tasks chart 
export const fetchChartData = async () => {
    try {
        const response = await apiClient.get(`/api/member/dashboard/tasks/weekly-summary`);
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch dashboard');
    }
};

// Fetch member tasks
export const fetchMemberTasks = async (projectId = null, offset = 1, searchTerm = '', pageSize = 10) => {
    try {
        const params = {
            offset: offset,
            limit: pageSize,
        };

        // Only include project_id in params if it is provided
        if (projectId) {
            params.project_id = projectId;
        }

        // Only include search term if it is provided
        if (searchTerm) {
            params.search = searchTerm;
        }

        const response = await apiClient.get(`/api/member/tasks`, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
    }
};

// Mutation to update a member task in a project
export const updateTaskStatus = async (projectId, taskId, status) => {
    try {
        const response = await apiClient.put(`/api/member/${projectId}/tasks/${taskId}`, { status });
        return response.data;
    } catch (error) {
        console.error('Error updating task:', error);
        throw new Error(error.response?.data?.message || 'Failed to update task');
    }
};

// Fetch notifications
export const fetchNotifications = async (page = 1, limit = 5, role) => {
    try {
        if (role === "member") {
            const response = await apiClient.get(`/api/member/notifications`, {
                params: { page, limit },
            });
            return response.data;
        } else if (role === "admin") {
            const response = await apiClient.get(`/api/notifications`, {
                params: { page, limit },
            });
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
    }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationID) => {
    const response = await apiClient.post(`/api/member/notifications/${notificationID}/mark-read`);
    return response.data;
};