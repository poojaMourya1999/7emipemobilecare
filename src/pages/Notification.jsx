import React, { useEffect, useState } from 'react';
import axios from 'axios';
import apiService, { baseUrl } from '../services/apiService';
import { NOTIFICATION } from '../services/apiUrl';
import { useNavigate } from 'react-router-dom';

const NotificationList = () => {
    const [notifications, setNotifications] = useState([]);
    const [selected, setSelected] = useState([]);

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            const res = await apiService({
                endpoint: NOTIFICATION,
                method: 'GET'
            });
            setNotifications(res?.notifications);
            
        } catch (err) {
            console.error('Error fetching notifications:', err.message);
        }
    };

    const markAsRead = async (id) => {
        const authToken = localStorage.getItem('token')
        try {
            await axios.patch(`${baseUrl}notifications/read/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
            });
            fetchNotifications();
        } catch (err) {
            console.error('Error updating notification:', err.message);
        }
    };

    const deleteNotification = async (id) => {
        try {
            const authToken = localStorage.getItem('token')
            await axios.delete(`${baseUrl}notifications/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
            }); // ✅ Single delete API
            fetchNotifications();
        } catch (err) {
            console.error('Error deleting notification:', err.message);
        }
    };

    const deleteSelected = async () => {
        const authToken = localStorage.getItem('token')
        try {
            await axios.post(`${baseUrl}notifications/delete-multiple`, { ids: selected }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
            }); // ✅ Bulk delete API
            setSelected([]);
            fetchNotifications();
        } catch (err) {
            console.error('Error deleting selected notifications:', err.message);
        }
    };

    const deleteAll = async () => {
        const authToken = localStorage.getItem('token')
        try {
            await axios.delete(`${baseUrl}notifications/delete-all`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
            }); // ✅ Delete all API
            setSelected([]);
            fetchNotifications();
        } catch (err) {
            console.error('Error deleting all notifications:', err.message);
        }
    };


    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div className="notification-list" style={styles.container}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Notifications</h2>
                <p className="text-sm text-white bg-blue-500 px-3 py-1 rounded-full">
                    {notifications.length}
                </p>
            </div>

            {notifications.length > 0 && (
                <div style={styles.actionBar}>
                    <button onClick={deleteSelected} disabled={selected.length === 0} style={styles.button}>
                        Delete Selected ({selected.length})
                    </button>
                    <button onClick={deleteAll} style={{ ...styles.button, backgroundColor: '#d9534f' }}>
                        Delete All
                    </button>
                </div>
            )}

            {notifications.map((n) => {
                const isChecked = selected.includes(n._id);
                return (
                    <div
                        key={n._id}
                        style={{
                            ...styles.notification,
                            backgroundColor: n.read ? '#f0f0f0' : '#e6f7ff',
                        }}
                    >
                        <input
                            type="checkbox"
                            style={styles.checkbox}
                            checked={isChecked}
                            onChange={() => toggleSelect(n._id)}
                        />
                        <div
                            onClick={() => !n.read && markAsRead(n._id)}
                            style={{ flex: 1, cursor: 'pointer' }}
                        >
                            <h4 style={styles.heading}>{n.title}</h4>
                            <p style={styles.message}>{n.message}</p>
                            <small style={styles.timestamp}>
                                {new Date(n.createdAt).toLocaleString()}
                            </small>
                            {!n.read && <span style={styles.badge}>New</span>}
                        </div>

                        {/* Only show delete button if this checkbox is selected */}
                        {isChecked && (
                            <button
                                onClick={() => deleteNotification(n._id)}
                                style={styles.deleteButton}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                );
            })}

            {notifications.length === 0 && (
                <p style={{ textAlign: 'center', color: '#777' }}>No notifications available.</p>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '1rem',
        maxWidth: '600px',
        margin: 'auto',
    },
    title: {
        fontSize: '1.5rem',
        marginBottom: '1rem',
    },
    actionBar: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1rem',
    },
    button: {
        padding: '0.5rem 1rem',
        fontSize: '0.9rem',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    notification: {
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid #ccc',
        marginBottom: '1rem',
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
    },
    checkbox: {
        marginRight: '0.75rem',
        marginTop: '0.5rem',
    },
    heading: {
        margin: '0 0 0.5rem',
        fontSize: '1.1rem',
    },
    message: {
        margin: 0,
        color: '#333',
    },
    timestamp: {
        fontSize: '0.8rem',
        color: '#777',
        marginTop: '0.5rem',
        display: 'block',
    },
    badge: {
        position: 'absolute',
        top: '10px',
        right: '80px',
        backgroundColor: '#ff4d4f',
        color: 'white',
        borderRadius: '12px',
        padding: '0.2rem 0.5rem',
        fontSize: '0.75rem',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '0.4rem 0.6rem',
        borderRadius: '4px',
        fontSize: '0.75rem',
        marginLeft: '1rem',
        cursor: 'pointer',
    },
};

export default NotificationList;
