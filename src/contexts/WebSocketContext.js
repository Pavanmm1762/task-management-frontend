// src/contexts/WebSocketContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import { requestNotificationPermission } from '../utils/notification';

const WebSocketContext = createContext();

export const useWebSocketContext = () => {
    return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Request notification permission when app loads
        requestNotificationPermission();

        // Get user ID from localStorage
        const userID = localStorage.getItem('userId');

        if (!userID) {
            console.error('User ID not found in localStorage');
            return;  // If userID is not available, don't proceed with WebSocket connection
        }

        const ws = new WebSocket(`ws://localhost:8081/ws?userID=${userID}`);

        ws.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        // Listen for messages from WebSocket server
        ws.onmessage = (event) => {
            const message = event.data;
            console.log('Received message:', message);

            try {
                // Try parsing the message as JSON
                //const parsedMessage = JSON.parse(message);

                // Show a browser notification if permission is granted
                if (Notification.permission === 'granted') {
                    new Notification('New Update', {
                        body: message, // Your message content
                        icon: '/notification-icon.png', // Optional icon
                    });
                }
            } catch (error) {
                // Handle non-JSON or malformed JSON messages
                console.error('Received non-JSON message:', message);
            }
        };


        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, []);

    return <WebSocketContext.Provider value={{ socket }}>{children}</WebSocketContext.Provider>;
};
