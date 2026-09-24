
import { useEffect, useState } from 'react';
import api from '../api/axios';
import TaskDetailModal from '../components/TaskDetailModal';

function Notifications() {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openTaskId, setOpenTaskId] = useState(null);

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchNotifications(); }, []);

    const openNotification = async (n) => {
        if (n.status === 'UNREAD') {
            await api.put(`/notifications/${n.notificationId}/read`);
            fetchNotifications();
        }
        if (n.relatedTaskId) {
            setOpenTaskId(n.relatedTaskId);
        }
    };

    const markAllAsRead = async () => {
        await api.put('/notifications/read-all');
        fetchNotifications();
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading notifications...</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h1>Notifications</h1>
                <button onClick={markAllAsRead}>Mark all as read</button>
            </div>

            {notifications.length === 0 && <p>No notifications yet.</p>}

            {notifications.map((n) => (
                <div
                    key={n.notificationId}
                    onClick={() => openNotification(n)}
                    style={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '0.75rem',
                        background: n.status === 'UNREAD' ? '#f0f7ff' : '#fff',
                        cursor: n.relatedTaskId ? 'pointer' : 'default'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong>{n.title}</strong>
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>
                            {n.sentDate ? new Date(n.sentDate).toLocaleString() : ''}
                        </span>
                    </div>
                    <p style={{ margin: '0.5rem 0' }}>{n.message}</p>
                    {n.relatedTaskId && (
                        <span style={{ fontSize: '0.8rem', color: '#2874a6' }}>
                            Click to view task →
                        </span>
                    )}
                </div>
            ))}

            {openTaskId && (
                <TaskDetailModal
                    taskId={openTaskId}
                    onClose={() => setOpenTaskId(null)}
                />
            )}
        </div>
    );
}

export default Notifications;