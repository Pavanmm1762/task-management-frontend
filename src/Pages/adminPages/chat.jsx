// Chat.js
import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';

const Chat = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const senderId = localStorage.getItem('userId');
    const recipientUUID = '7e6c8105-89e4-11ee-b6eb-00ff04f5e20c';
    useEffect(() => {
        const newSocket = new WebSocket('ws://localhost:8080/ws?senderUUID=' + senderId + '&recipientUUID=' + recipientUUID);

        newSocket.onopen = () => {
            console.log('WebSocket connected');
            setSocket(newSocket);
        };

        newSocket.onmessage = (event) => {
            const receivedMessage = JSON.parse(event.data);
            console.log('Received message from server:', receivedMessage);
            setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        };

        newSocket.onclose = () => {
            console.log('WebSocket closed');
        };

        return () => {
            newSocket.close();
        };
    }, [senderId, recipientUUID]);


    const sendMessage = () => {
        if (socket && newMessage.trim() !== '') {
            const message = {
                text: newMessage, sender: senderId, recipient_id: recipientUUID
            };
            socket.send(JSON.stringify(message));
            setMessages((prevMessages) => [...prevMessages, message]);
            setNewMessage('');
        }
    };

    return (
        <div className="flex flex-col  w-96 p-10 h-96 m-10 border dark:border-white">
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`mb-4 ${message.sender === senderId ? 'text-right ml-4' : 'text-left mr-4'}`}
                    >
                        <span
                            className={`inline-block p-2 rounded-lg ${message.sender === senderId ? 'bg-blue-500 text-white' : 'bg-gray-300'
                                }`}
                        >
                            {message.text}
                        </span>
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-between p-4 border-t">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 p-2 border rounded-md mr-2"
                    placeholder="Type your message..."
                />
                <button
                    onClick={() => sendMessage()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Send
                </button>
            </div>
        </div >
    );
};

export default Chat;
