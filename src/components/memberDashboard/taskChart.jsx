'use client'

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TaskChart = ({ chartData = [] }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Task Overview</h3>
            <div className="h-64 sm:h-80  lg:h-[300px] ">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                        />
                        <Legend />
                        <Bar dataKey="completed" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="in_progress" stackId="a" fill="#FBBF24" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="review" stackId="a" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="overdue" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TaskChart;

