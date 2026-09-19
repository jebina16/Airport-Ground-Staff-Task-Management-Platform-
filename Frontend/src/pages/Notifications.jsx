import { useEffect, useState } from 'react';
import api from '../api/axios';

function Notifications() {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error('Unable to load notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            fetchNotifications();
        } catch (error) {
            console.error(error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            fetchNotifications();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return <div className="loading">Loading notifications...</div>;
    }

    return (
        <div style={{ padding: '2rem' }}>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
            }}>
                <h1>Notifications</h1>
                <button onClick={markAllAsRead}>
                    Mark all as read
                </button>
            </div>

            {notifications.length === 0 && (
                <p>No notifications yet.</p>
            )}

            {notifications.map((n) => (
                <div
                    key={n.notificationId}
                    style={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '0.75rem',
                        background: n.status === 'UNREAD'
                            ? '#f0f7ff'
                            : '#ffffff'
                    }}
                >
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <strong>{n.title}</strong>
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>
                            {n.sentDate
                                ? new Date(n.sentDate).toLocaleString()
                                : ''}
                        </span>
                    </div>

                    <p style={{ margin: '0.5rem 0' }}>{n.message}</p>

                    {n.status === 'UNREAD' && (
                        <button onClick={() => markAsRead(n.notificationId)}>
                            Mark as read
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Notifications;