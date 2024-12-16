
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Clock, Calendar } from 'lucide-react';
import { toast } from "react-toastify";
import { fetchMemberTasks, updateTaskStatus } from '../../../services/apiService';
import { useDebounce } from 'use-debounce';
import { useInView } from 'react-intersection-observer';
import { format, parse, isValid, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns';

const columns = [
    { id: 'pending', title: 'To Do' },
    { id: 'in progress', title: 'In Progress' },
    { id: 'review', title: 'Review' },
    { id: 'completed', title: 'Completed' },
]

const priorityColors = {
    'high': 'bg-red-100 text-red-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'low': 'bg-green-100 text-green-800'
}

const TaskBoardContent = () => {
    const queryClient = useQueryClient();
    // eslint-disable-next-line no-unused-vars
    const [searchTerm, setSearchTerm] = useState('');
    const [offset, setOffset] = useState(0);
    const pageSize = 10;
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['memberTasks', '', offset, debouncedSearchTerm],
        queryFn: () => fetchMemberTasks('', offset, debouncedSearchTerm, pageSize),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        retry: 2,
    });
    const tasks = data?.tasks || [];

    const updateTaskMutation = useMutation({
        mutationFn: ({ projectId, taskId, status }) =>
            updateTaskStatus(projectId, taskId, status),
        onSuccess: () => {
            queryClient.invalidateQueries(['memberTasks']);
            toast.success('Task updated successfully');
        },
    });


    const onDragEnd = (result) => {
        if (!result || !result.destination) return;

        const { source, destination, draggableId } = result;

        // Find the dragged task using the draggableId
        const draggedTask = tasks.find((task) => task.id === draggableId);

        if (!draggedTask || source.droppableId === destination.droppableId) return;

        const updatedTask = {
            projectId: draggedTask.project_id,
            taskId: draggedTask.id,
            status: destination.droppableId, // Set the new status from the destination
        };

        console.log('Updated Task:', updatedTask);

        // Optimistic UI Update
        const previousTaskStatus = draggedTask.status;
        queryClient.setQueryData(['memberTasks', '', offset, debouncedSearchTerm], (oldData) => {
            if (!oldData) return oldData;

            return {
                ...oldData,
                tasks: oldData.tasks.map((task) =>
                    task.id === draggedTask.id
                        ? { ...task, status: destination.droppableId }
                        : task
                ),
            };
        });

        // Make the API call to update the task status on the backend
        updateTaskMutation.mutate(updatedTask, {
            onError: () => {
                // Revert the task status back to its previous state if the mutation fails
                queryClient.setQueryData(['memberTasks', '', offset, debouncedSearchTerm], (oldData) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        tasks: oldData.tasks.map((task) =>
                            task.id === draggedTask.id
                                ? { ...task, status: previousTaskStatus }
                                : task
                        ),
                    };
                });
                toast.error('Failed to update task');
            },
        });
    };

    // Infinite Scroll Handling
    const loadMoreRef = useInView({
        triggerOnce: false, // To keep loading more when the user scrolls to the bottom
        onChange: (inView) => {
            if (inView && !isLoading) {
                setOffset((prev) => prev + pageSize);  // Increment the offset to load next set of tasks
            }
        },
    });

    const getRemainingTime = (task) => {
        if (task.status === 'completed') {
            return <span className="text-green-500">Completed </span>
        }

        if (task.status === 'review') {
            return <span className="text-yellow-500 capitalize">in review </span>
        }

        if (!task.due_date) {
            return <span className="text-gray-500 ">No due date</span>
        }

        // Parse the custom date format
        const dueDate = parse(task.due_date, 'dd-MM-yyyy hh:mm:ss a', new Date())

        // Validate the parsed date
        if (!isValid(dueDate)) {
            console.error('Invalid due date:', task.due_date)
            return <span className="text-gray-500">Invalid date</span>
        }

        if (isPast(dueDate)) {
            return <span className="text-red-500">Overdue </span>
        }

        return (
            <span className="text-blue-500">
                {formatDistanceToNow(dueDate, { addSuffix: true })}
            </span>
        )
    }

    const getTaskBorderColor = (task) => {
        if (task.status === 'completed') return 'hover:shadow-[0_0_0_1px_rgba(34,197,94,0.3)]'
        if (task.status === 'review') return 'hover:shadow-[0_0_0_1px_rgba(220,187,84,0.3)]'
        const dueDate = parse(task.due_date, 'dd-MM-yyyy hh:mm:ss a', new Date())
        if (!dueDate) return 'hover:shadow-[0_0_0_1px_rgba(156,163,175,0.3)]'
        if (isPast(dueDate)) return 'hover:shadow-[0_0_0_1px_rgba(239,68,68,0.3)]'
        if (isToday(dueDate)) return 'hover:shadow-[0_0_0_1px_rgba(234,179,8,0.3)]'
        if (isTomorrow(dueDate)) return 'hover:shadow-[0_0_0_1px_rgba(59,130,246,0.3)]'
        return 'hover:shadow-[0_0_0_1px_rgba(156,163,175,0.3)]'
    }

    if (isLoading && offset === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (isError) {
        return <div className="text-center text-red-500">Error loading tasks</div>
    }

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Task Management Board</h1>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {columns.map((column) => {
                        const tasksInColumn =
                            column.id === 'in progress'
                                ? tasks.filter((task) => task.status === 'in progress' || task.status === 'overdue')
                                : tasks.filter((task) => task.status === column.id);

                        return (
                            <div key={column.id} className="bg-gray-100 p-4 rounded-lg">
                                <h2 className="font-semibold mb-4 text-lg">{column.title}</h2>
                                <Droppable droppableId={column.id}>
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="min-h-[200px]"
                                        >
                                            {tasksInColumn.length === 0 ? (
                                                < div className="text-center text-gray-500">No tasks available in this status.</div>
                                            ) : (
                                                tasksInColumn.map((task, index) => (
                                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`
                                                                    mb-4 p-4 bg-white rounded-lg shadow cursor-move
                                                                    transition-all duration-200 ease-in-out
                                                                    hover:shadow-md 
                                                                    ${snapshot.isDragging ? 'shadow-lg scale-105' : ''}
                                                                    ${getTaskBorderColor(task)}
                                                                  `}
                                                            >
                                                                <div className="pb-2">
                                                                    <div className="flex justify-between items-start pb-1">
                                                                        <h3 className="text-lg font-semibold capitalize line-clamp-2">{task.title}</h3>
                                                                    </div>
                                                                    <p className="text-sm text-gray-600 line-clamp-1">
                                                                        {task.description.charAt(0).toUpperCase() + task.description.slice(1)}
                                                                    </p>
                                                                </div>
                                                                <div className="flex flex-wrap items-center text-xs gap-2">
                                                                    <span className={`px-2 py-1 rounded-full capitalize ${priorityColors[task.priority]}`}>
                                                                        {task.priority}
                                                                    </span>
                                                                    {task.due_date ? (
                                                                        <span className="flex items-center text-gray-600">
                                                                            <Calendar className="h-3 w-3 mr-1" />
                                                                            {format(parse(task.due_date, 'dd-MM-yyyy hh:mm:ss a', new Date()), 'MMM d, yyyy')}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="flex items-center text-gray-600">
                                                                            <Calendar className="h-3 w-3 mr-1" />
                                                                            No due date
                                                                        </span>
                                                                    )}
                                                                    <span className="flex items-center ml-auto">
                                                                        <Clock className="h-3 w-3 mr-1" />
                                                                        {getRemainingTime(task)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))
                                            )}
                                            {provided.placeholder}
                                        </div>
                                    )
                                    }
                                </Droppable>
                            </div>
                        );
                    })}
                </div >
            </DragDropContext >

            {/* Infinite Scroll Trigger */}
            < div ref={loadMoreRef} className="h-16" ></div >

            {isLoading && offset > 0 && (
                <div className="flex justify-center items-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            )}
        </div >
    );
};

export default TaskBoardContent;