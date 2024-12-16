import React from 'react';

const chats = [
    { id: 1, user: 'John  ', message: 'Can you review the latest design?', time: '10:30 AM' },
    { id: 2, user: 'Jane Smith', message: 'Meeting at 2 PM today', time: 'Yesterday' },
    { id: 3, user: 'Mike Johnson', message: 'Project deadline extended', time: '2 days ago' },
];

const RecentChats = () => {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Chats</h3>
            </div>
            <ul className="divide-y divide-gray-200">
                {chats.map((chat) => (
                    <li key={chat.id} className="px-4 py-3 sm:px-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <img className="h-8 w-8 rounded-full"
                                    src={`https://ui-avatars.com/api/?name=${chat.user}&background=random`} alt={chat.user} />
                            </div>
                            <div className="ml-3 flex-grow">
                                <p className="text-sm font-medium text-gray-900">{chat.user}</p>
                                <p className="text-xs text-gray-500">{chat.message}</p>
                            </div>
                            <div className="ml-auto">
                                <p className="text-xs text-gray-400">{chat.time}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentChats;

